import { requireAuth, getCurrentUser, logout } from "./api.js"
import { getPedidos, deletePedido } from "./api.js"
import { showAlert, showLoading, hideLoading, formatDateTime, getStatusBadgeClass, getStatusLabel } from "./utils.js"

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

// Store all pedidos
let allPedidos = []
let selectedPedido = null

// Load pedidos
async function loadPedidos() {
  try {
    showLoading()
    allPedidos = await getPedidos()
    hideLoading()
    renderPedidos(allPedidos)
  } catch (error) {
    hideLoading()
    console.error("Error loading pedidos:", error)
    showAlert("Erro ao carregar pedidos", "error")
    document.getElementById("pedidosTable").innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-muted">
          Erro ao carregar pedidos. Tente novamente.
        </td>
      </tr>
    `
  }
}

// Render pedidos table
function renderPedidos(pedidos) {
  const tbody = document.getElementById("pedidosTable")

  if (!pedidos || pedidos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-muted">
          Nenhum pedido encontrado. <a href="veiculos.html" class="auth-link">Faça seu primeiro pedido</a>
        </td>
      </tr>
    `
    return
  }

  tbody.innerHTML = pedidos
    .map(
      (pedido) => `
    <tr>
      <td>#${pedido.id || "-"}</td>
      <td>
        ${pedido.veiculo ? `${pedido.veiculo.marca} ${pedido.veiculo.modelo}` : "Veículo não especificado"}
      </td>
      <td>${pedido.dataPedido ? formatDateTime(pedido.dataPedido) : "-"}</td>
      <td>
        <span class="badge ${getStatusBadgeClass(pedido.status)}">
          ${getStatusLabel(pedido.status)}
        </span>
      </td>
      <td>
        <button 
          class="btn btn-sm btn-primary" 
          onclick="window.viewPedido(${pedido.id})"
        >
          Ver Detalhes
        </button>
        ${
          pedido.status === "em_analise"
            ? `
          <button 
            class="btn btn-sm btn-danger" 
            onclick="window.cancelPedido(${pedido.id})"
          >
            Cancelar
          </button>
        `
            : ""
        }
      </td>
    </tr>
  `,
    )
    .join("")
}

// Filter pedidos by status
const statusFilter = document.getElementById("statusFilter")
if (statusFilter) {
  statusFilter.addEventListener("change", () => {
    const selectedStatus = statusFilter.value
    if (!selectedStatus) {
      renderPedidos(allPedidos)
    } else {
      const filtered = allPedidos.filter((p) => p.status === selectedStatus)
      renderPedidos(filtered)
    }
  })
}

// Refresh button
const refreshBtn = document.getElementById("refreshBtn")
if (refreshBtn) {
  refreshBtn.addEventListener("click", () => {
    loadPedidos()
    showAlert("Pedidos atualizados", "success")
  })
}

// View pedido details
window.viewPedido = (pedidoId) => {
  selectedPedido = allPedidos.find((p) => p.id === pedidoId)
  if (!selectedPedido) return

  const modal = document.getElementById("pedidoModal")
  const details = document.getElementById("pedidoDetails")
  const actions = document.getElementById("modalActions")

  details.innerHTML = `
    <div class="form-group">
      <label class="form-label">ID do Pedido</label>
      <p class="text-secondary">#${selectedPedido.id}</p>
    </div>
    <div class="form-group">
      <label class="form-label">Veículo</label>
      <p class="text-secondary">
        ${selectedPedido.veiculo ? `${selectedPedido.veiculo.marca} ${selectedPedido.veiculo.modelo} (${selectedPedido.veiculo.placa})` : "Não especificado"}
      </p>
    </div>
    <div class="form-group">
      <label class="form-label">Data do Pedido</label>
      <p class="text-secondary">${selectedPedido.dataPedido ? formatDateTime(selectedPedido.dataPedido) : "-"}</p>
    </div>
    <div class="form-group">
      <label class="form-label">Status</label>
      <p>
        <span class="badge ${getStatusBadgeClass(selectedPedido.status)}">
          ${getStatusLabel(selectedPedido.status)}
        </span>
      </p>
    </div>
    ${
      selectedPedido.observacoes
        ? `
      <div class="form-group">
        <label class="form-label">Observações</label>
        <p class="text-secondary">${selectedPedido.observacoes}</p>
      </div>
    `
        : ""
    }
  `

  // Show appropriate actions based on status
  if (selectedPedido.status === "em_analise") {
    actions.innerHTML = `
      <button class="btn btn-danger" id="cancelPedidoModalBtn">
        Cancelar Pedido
      </button>
      <button class="btn btn-outline" id="closeModalBtn">Fechar</button>
    `

    const cancelBtn = document.getElementById("cancelPedidoModalBtn")
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        modal.classList.remove("active")
        window.cancelPedido(selectedPedido.id)
      })
    }
  } else if (selectedPedido.status === "aprovado") {
    actions.innerHTML = `
      <a href="contratos.html" class="btn btn-success">
        Gerar Contrato
      </a>
      <button class="btn btn-outline" id="closeModalBtn">Fechar</button>
    `
  } else {
    actions.innerHTML = `
      <button class="btn btn-outline" id="closeModalBtn">Fechar</button>
    `
  }

  // Add close button handler
  const closeBtn = document.getElementById("closeModalBtn")
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("active")
    })
  }

  modal.classList.add("active")
}

// Cancel pedido
window.cancelPedido = async (pedidoId) => {
  if (!confirm("Tem certeza que deseja cancelar este pedido?")) {
    return
  }

  try {
    showLoading()
    await deletePedido(pedidoId)
    hideLoading()
    showAlert("Pedido cancelado com sucesso", "success")
    loadPedidos()
  } catch (error) {
    hideLoading()
    console.error("Error canceling pedido:", error)
    showAlert(error.message || "Erro ao cancelar pedido", "error")
  }
}

// Close modal
const closeModal = document.getElementById("closeModal")
const pedidoModal = document.getElementById("pedidoModal")

if (closeModal) {
  closeModal.addEventListener("click", () => {
    pedidoModal.classList.remove("active")
  })
}

// Load pedidos on page load
loadPedidos()
