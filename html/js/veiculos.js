import { requireAuth, getCurrentUser, logout } from "./api.js"
import { getVeiculos, createPedido } from "./api.js"
import { showAlert, showLoading, hideLoading, debounce } from "./utils.js"

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

// Store all vehicles
let allVeiculos = []
let selectedVeiculo = null

// Load vehicles
async function loadVeiculos() {
  try {
    showLoading()
    allVeiculos = await getVeiculos()
    hideLoading()
    renderVeiculos(allVeiculos)
    populateFilters(allVeiculos)
  } catch (error) {
    hideLoading()
    console.error("Error loading vehicles:", error)
    showAlert("Erro ao carregar veículos", "error")
    document.getElementById("veiculosTable").innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-muted">
          Erro ao carregar veículos. Tente novamente.
        </td>
      </tr>
    `
  }
}

// Render vehicles table
function renderVeiculos(veiculos) {
  const tbody = document.getElementById("veiculosTable")

  if (!veiculos || veiculos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-muted">
          Nenhum veículo encontrado
        </td>
      </tr>
    `
    return
  }

  tbody.innerHTML = veiculos
    .map(
      (veiculo) => `
    <tr>
      <td>${veiculo.marca || "-"}</td>
      <td>${veiculo.modelo || "-"}</td>
      <td>${veiculo.ano || "-"}</td>
      <td>${veiculo.placa || "-"}</td>
      <td>
        <span class="badge ${veiculo.disponivel ? "badge-success" : "badge-danger"}">
          ${veiculo.disponivel ? "Disponível" : "Indisponível"}
        </span>
      </td>
      <td>
        <button 
          class="btn btn-sm btn-primary" 
          onclick="window.viewVeiculo(${veiculo.id})"
          ${!veiculo.disponivel ? "disabled" : ""}
        >
          Ver Detalhes
        </button>
      </td>
    </tr>
  `,
    )
    .join("")
}

// Populate filter dropdowns
function populateFilters(veiculos) {
  // Get unique brands
  const marcas = [...new Set(veiculos.map((v) => v.marca).filter(Boolean))]
  const filterMarca = document.getElementById("filterMarca")
  if (filterMarca) {
    filterMarca.innerHTML =
      '<option value="">Todas as marcas</option>' +
      marcas.map((marca) => `<option value="${marca}">${marca}</option>`).join("")
  }

  // Get unique years
  const anos = [...new Set(veiculos.map((v) => v.ano).filter(Boolean))].sort((a, b) => b - a)
  const filterAno = document.getElementById("filterAno")
  if (filterAno) {
    filterAno.innerHTML =
      '<option value="">Todos os anos</option>' + anos.map((ano) => `<option value="${ano}">${ano}</option>`).join("")
  }
}

// Filter vehicles
function filterVeiculos() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase()
  const selectedMarca = document.getElementById("filterMarca").value
  const selectedAno = document.getElementById("filterAno").value

  const filtered = allVeiculos.filter((veiculo) => {
    const matchesSearch =
      !searchTerm ||
      (veiculo.marca && veiculo.marca.toLowerCase().includes(searchTerm)) ||
      (veiculo.modelo && veiculo.modelo.toLowerCase().includes(searchTerm)) ||
      (veiculo.placa && veiculo.placa.toLowerCase().includes(searchTerm))

    const matchesMarca = !selectedMarca || veiculo.marca === selectedMarca
    const matchesAno = !selectedAno || veiculo.ano === Number.parseInt(selectedAno)

    return matchesSearch && matchesMarca && matchesAno
  })

  renderVeiculos(filtered)
}

// Search input with debounce
const searchInput = document.getElementById("searchInput")
if (searchInput) {
  searchInput.addEventListener("input", debounce(filterVeiculos, 300))
}

// Filter dropdowns
const filterMarca = document.getElementById("filterMarca")
const filterAno = document.getElementById("filterAno")

if (filterMarca) {
  filterMarca.addEventListener("change", filterVeiculos)
}

if (filterAno) {
  filterAno.addEventListener("change", filterVeiculos)
}

// Clear filters
const clearFilters = document.getElementById("clearFilters")
if (clearFilters) {
  clearFilters.addEventListener("click", () => {
    document.getElementById("searchInput").value = ""
    document.getElementById("filterMarca").value = ""
    document.getElementById("filterAno").value = ""
    renderVeiculos(allVeiculos)
  })
}

// View vehicle details
window.viewVeiculo = (veiculoId) => {
  selectedVeiculo = allVeiculos.find((v) => v.id === veiculoId)
  if (!selectedVeiculo) return

  const modal = document.getElementById("veiculoModal")
  const details = document.getElementById("veiculoDetails")

  details.innerHTML = `
    <div class="form-group">
      <label class="form-label">Marca</label>
      <p class="text-secondary">${selectedVeiculo.marca || "-"}</p>
    </div>
    <div class="form-group">
      <label class="form-label">Modelo</label>
      <p class="text-secondary">${selectedVeiculo.modelo || "-"}</p>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Ano</label>
        <p class="text-secondary">${selectedVeiculo.ano || "-"}</p>
      </div>
      <div class="form-group">
        <label class="form-label">Placa</label>
        <p class="text-secondary">${selectedVeiculo.placa || "-"}</p>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Status</label>
      <p>
        <span class="badge ${selectedVeiculo.disponivel ? "badge-success" : "badge-danger"}">
          ${selectedVeiculo.disponivel ? "Disponível" : "Indisponível"}
        </span>
      </p>
    </div>
  `

  modal.classList.add("active")
}

// Close modal
const closeModal = document.getElementById("closeModal")
const cancelModalBtn = document.getElementById("cancelModalBtn")
const veiculoModal = document.getElementById("veiculoModal")

if (closeModal) {
  closeModal.addEventListener("click", () => {
    veiculoModal.classList.remove("active")
  })
}

if (cancelModalBtn) {
  cancelModalBtn.addEventListener("click", () => {
    veiculoModal.classList.remove("active")
  })
}

// Solicitar pedido
const solicitarPedidoBtn = document.getElementById("solicitarPedidoBtn")
if (solicitarPedidoBtn) {
  solicitarPedidoBtn.addEventListener("click", async () => {
    if (!selectedVeiculo) return

    if (!confirm(`Deseja solicitar um pedido para o veículo ${selectedVeiculo.marca} ${selectedVeiculo.modelo}?`)) {
      return
    }

    try {
      showLoading()
      await createPedido({
        veiculoId: selectedVeiculo.id,
        clienteId: currentUser.id,
      })
      hideLoading()
      showAlert("Pedido solicitado com sucesso!", "success")
      veiculoModal.classList.remove("active")
      setTimeout(() => {
        window.location.href = "/pedidos.html"
      }, 1500)
    } catch (error) {
      hideLoading()
      console.error("Error creating pedido:", error)
      showAlert(error.message || "Erro ao solicitar pedido", "error")
    }
  })
}

// Load vehicles on page load
loadVeiculos()
