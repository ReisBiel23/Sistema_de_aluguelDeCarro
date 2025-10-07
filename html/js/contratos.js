import { requireAuth, getCurrentUser, logout } from "./api.js"
import { getContratos, createContrato, getPedidos } from "./api.js"
import { showAlert, showLoading, hideLoading, formatDate, getStatusBadgeClass, getStatusLabel } from "./utils.js"

// Require authentication
requireAuth()

// Get current user
const currentUser = getCurrentUser()

// Update user info in sidebar
if (currentUser) {
  const userName = document.getElementById("userName")
  const userRole = document.getElementById("userRole")
  const userAvatar = document.getElementById("userAvatar")

  if (userName) userName.textContent = currentUser.nome || "Usuário"
  if (userRole) {
    const roleMap = {
      cliente: "Cliente",
      empresario: "Empresário",
      agente: "Agente",
    }
    userRole.textContent = roleMap[currentUser.tipo] || "Cliente"
  }
  if (userAvatar) {
    userAvatar.textContent = (currentUser.nome || "U").charAt(0).toUpperCase()
  }
}

// Mobile menu toggle
const menuToggle = document.getElementById("menuToggle")
const sidebar = document.getElementById("sidebar")
const sidebarOverlay = document.getElementById("sidebarOverlay")

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("active")
    sidebarOverlay.classList.toggle("active")
  })
}

if (sidebarOverlay) {
  sidebarOverlay.addEventListener("click", () => {
    sidebar.classList.remove("active")
    sidebarOverlay.classList.remove("active")
  })
}

// Logout handler
const logoutBtn = document.getElementById("logoutBtn")
if (logoutBtn) {
  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault()
    if (confirm("Tem certeza que deseja sair?")) {
      await logout()
    }
  })
}

// Store all contratos
let allContratos = []
let selectedContrato = null
let pedidosAprovados = []

// Load contratos
async function loadContratos() {
  try {
    showLoading()
    allContratos = await getContratos()
    hideLoading()
    renderContratos(allContratos)
  } catch (error) {
    hideLoading()
    console.error("Error loading contratos:", error)
    showAlert("Erro ao carregar contratos", "error")
    document.getElementById("contratosTable").innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-muted">
          Erro ao carregar contratos. Tente novamente.
        </td>
      </tr>
    `
  }
}

// Render contratos table
function renderContratos(contratos) {
  const tbody = document.getElementById("contratosTable")

  if (!contratos || contratos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-muted">
          Nenhum contrato encontrado. <button class="btn btn-sm btn-primary" id="gerarPrimeiroContrato">Gerar primeiro contrato</button>
        </td>
      </tr>
    `

    const btn = document.getElementById("gerarPrimeiroContrato")
    if (btn) {
      btn.addEventListener("click", () => {
        document.getElementById("novoContratoBtn").click()
      })
    }
    return
  }

  tbody.innerHTML = contratos
    .map(
      (contrato) => `
    <tr>
      <td>#${contrato.id || "-"}</td>
      <td>#${contrato.pedidoId || "-"}</td>
      <td>
        ${contrato.veiculo ? `${contrato.veiculo.marca} ${contrato.veiculo.modelo}` : "Não especificado"}
      </td>
      <td>${contrato.dataCriacao ? formatDate(contrato.dataCriacao) : "-"}</td>
      <td>
        <span class="badge ${getStatusBadgeClass(contrato.status)}">
          ${getStatusLabel(contrato.status)}
        </span>
      </td>
      <td>
        <button 
          class="btn btn-sm btn-primary" 
          onclick="window.viewContrato(${contrato.id})"
        >
          Ver Detalhes
        </button>
      </td>
    </tr>
  `,
    )
    .join("")
}

// Load pedidos aprovados for novo contrato
async function loadPedidosAprovados() {
  try {
    const allPedidos = await getPedidos()
    pedidosAprovados = allPedidos.filter((p) => p.status === "aprovado")

    const select = document.getElementById("pedidoSelect")
    if (select) {
      if (pedidosAprovados.length === 0) {
        select.innerHTML = '<option value="">Nenhum pedido aprovado disponível</option>'
      } else {
        select.innerHTML =
          '<option value="">Selecione um pedido...</option>' +
          pedidosAprovados
            .map(
              (p) =>
                `<option value="${p.id}">Pedido #${p.id} - ${p.veiculo ? `${p.veiculo.marca} ${p.veiculo.modelo}` : "Veículo"}</option>`,
            )
            .join("")
      }
    }
  } catch (error) {
    console.error("Error loading pedidos:", error)
    const select = document.getElementById("pedidoSelect")
    if (select) {
      select.innerHTML = '<option value="">Erro ao carregar pedidos</option>'
    }
  }
}

// Novo contrato button
const novoContratoBtn = document.getElementById("novoContratoBtn")
const novoContratoModal = document.getElementById("novoContratoModal")

if (novoContratoBtn) {
  novoContratoBtn.addEventListener("click", async () => {
    await loadPedidosAprovados()
    novoContratoModal.classList.add("active")

    // Set default dates
    const today = new Date()
    const dataInicio = document.getElementById("dataInicio")
    const dataFim = document.getElementById("dataFim")

    if (dataInicio) {
      dataInicio.value = today.toISOString().split("T")[0]
      dataInicio.min = today.toISOString().split("T")[0]
    }

    if (dataFim) {
      const nextMonth = new Date(today)
      nextMonth.setMonth(nextMonth.getMonth() + 1)
      dataFim.value = nextMonth.toISOString().split("T")[0]
      dataFim.min = today.toISOString().split("T")[0]
    }
  })
}

// Close novo contrato modal
const closeNovoModal = document.getElementById("closeNovoModal")
const cancelNovoBtn = document.getElementById("cancelNovoBtn")

if (closeNovoModal) {
  closeNovoModal.addEventListener("click", () => {
    novoContratoModal.classList.remove("active")
  })
}

if (cancelNovoBtn) {
  cancelNovoBtn.addEventListener("click", () => {
    novoContratoModal.classList.remove("active")
  })
}

// Novo contrato form submit
const novoContratoForm = document.getElementById("novoContratoForm")
if (novoContratoForm) {
  novoContratoForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const pedidoId = document.getElementById("pedidoSelect").value
    const dataInicio = document.getElementById("dataInicio").value
    const dataFim = document.getElementById("dataFim").value
    const observacoes = document.getElementById("observacoes").value

    if (!pedidoId) {
      showAlert("Por favor, selecione um pedido", "error")
      return
    }

    // Validate dates
    if (new Date(dataFim) <= new Date(dataInicio)) {
      showAlert("A data de término deve ser posterior à data de início", "error")
      return
    }

    const contratoData = {
      pedidoId: Number.parseInt(pedidoId),
      dataInicio,
      dataFim,
      observacoes,
    }

    try {
      showLoading()
      await createContrato(contratoData)
      hideLoading()
      showAlert("Contrato gerado com sucesso!", "success")
      novoContratoModal.classList.remove("active")
      novoContratoForm.reset()
      loadContratos()
    } catch (error) {
      hideLoading()
      console.error("Error creating contrato:", error)
      showAlert(error.message || "Erro ao gerar contrato", "error")
    }
  })
}

// View contrato details
window.viewContrato = (contratoId) => {
  selectedContrato = allContratos.find((c) => c.id === contratoId)
  if (!selectedContrato) return

  const modal = document.getElementById("contratoModal")
  const details = document.getElementById("contratoDetails")

  details.innerHTML = `
    <div class="form-group">
      <label class="form-label">ID do Contrato</label>
      <p class="text-secondary">#${selectedContrato.id}</p>
    </div>
    <div class="form-group">
      <label class="form-label">Pedido Relacionado</label>
      <p class="text-secondary">#${selectedContrato.pedidoId || "-"}</p>
    </div>
    <div class="form-group">
      <label class="form-label">Veículo</label>
      <p class="text-secondary">
        ${selectedContrato.veiculo ? `${selectedContrato.veiculo.marca} ${selectedContrato.veiculo.modelo} (${selectedContrato.veiculo.placa})` : "Não especificado"}
      </p>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Data de Início</label>
        <p class="text-secondary">${selectedContrato.dataInicio ? formatDate(selectedContrato.dataInicio) : "-"}</p>
      </div>
      <div class="form-group">
        <label class="form-label">Data de Término</label>
        <p class="text-secondary">${selectedContrato.dataFim ? formatDate(selectedContrato.dataFim) : "-"}</p>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Data de Criação</label>
      <p class="text-secondary">${selectedContrato.dataCriacao ? formatDate(selectedContrato.dataCriacao) : "-"}</p>
    </div>
    <div class="form-group">
      <label class="form-label">Status</label>
      <p>
        <span class="badge ${getStatusBadgeClass(selectedContrato.status)}">
          ${getStatusLabel(selectedContrato.status)}
        </span>
      </p>
    </div>
    ${
      selectedContrato.observacoes
        ? `
      <div class="form-group">
        <label class="form-label">Observações</label>
        <p class="text-secondary">${selectedContrato.observacoes}</p>
      </div>
    `
        : ""
    }
  `

  modal.classList.add("active")
}

// Download contrato (placeholder)
const downloadContratoBtn = document.getElementById("downloadContratoBtn")
if (downloadContratoBtn) {
  downloadContratoBtn.addEventListener("click", () => {
    if (!selectedContrato) return
    showAlert("Funcionalidade de download em desenvolvimento", "info")
    // In a real implementation, this would generate and download a PDF
  })
}

// Close contrato modal
const closeModal = document.getElementById("closeModal")
const closeModalBtn = document.getElementById("closeModalBtn")
const contratoModal = document.getElementById("contratoModal")

if (closeModal) {
  closeModal.addEventListener("click", () => {
    contratoModal.classList.remove("active")
  })
}

if (closeModalBtn) {
  closeModalBtn.addEventListener("click", () => {
    contratoModal.classList.remove("active")
  })
}

// Load contratos on page load
loadContratos()
