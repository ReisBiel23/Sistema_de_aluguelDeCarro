import { requireAuth, getCurrentUser, logout } from "./api.js"
import { getVeiculos, getPedidos, getContratos } from "./api.js"
import { showAlert } from "./utils.js"

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

// Load dashboard stats
async function loadDashboardStats() {
  try {
    // Load vehicles count
    const veiculos = await getVeiculos()
    const statVeiculos = document.getElementById("statVeiculos")
    if (statVeiculos) {
      statVeiculos.textContent = veiculos.length || 0
    }

    // Load pedidos count
    const pedidos = await getPedidos()
    const statPedidos = document.getElementById("statPedidos")
    if (statPedidos) {
      statPedidos.textContent = pedidos.length || 0
    }

    // Load contratos count
    const contratos = await getContratos()
    const statContratos = document.getElementById("statContratos")
    if (statContratos) {
      statContratos.textContent = contratos.length || 0
    }

    // Financiamentos - placeholder
    const statFinanciamentos = document.getElementById("statFinanciamentos")
    if (statFinanciamentos) {
      statFinanciamentos.textContent = "0"
    }
  } catch (error) {
    console.error("Error loading dashboard stats:", error)
    showAlert("Erro ao carregar estatísticas", "error")
  }
}

// Load stats on page load
loadDashboardStats()

// Set active nav link based on current page
function setActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "dashboard.html"
  const navLinks = document.querySelectorAll(".nav-link")

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active")
    }
  })
}

setActiveNavLink()
