import { requireAuth, getCurrentUser, logout, updateUsuario, setCurrentUser } from "./api.js"
import { showAlert, showLoading, hideLoading, formatCPF } from "./utils.js"

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

// Load user data into form
function loadUserData() {
  if (!currentUser) return

  document.getElementById("nome").value = currentUser.nome || ""
  document.getElementById("cpf").value = currentUser.cpf ? formatCPF(currentUser.cpf) : ""
  document.getElementById("rg").value = currentUser.rg || ""
  document.getElementById("email").value = currentUser.email || ""
  document.getElementById("endereco").value = currentUser.endereco || ""
  document.getElementById("profissao").value = currentUser.profissao || ""
}

// Perfil form handler
const perfilForm = document.getElementById("perfilForm")
if (perfilForm) {
  perfilForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const userData = {
      nome: document.getElementById("nome").value.trim(),
      rg: document.getElementById("rg").value.trim(),
      email: document.getElementById("email").value.trim(),
      endereco: document.getElementById("endereco").value.trim(),
      profissao: document.getElementById("profissao").value.trim(),
    }

    try {
      showLoading()
      const updatedUser = await updateUsuario(currentUser.id, userData)
      hideLoading()

      // Update stored user data
      setCurrentUser({ ...currentUser, ...updatedUser })

      showAlert("Perfil atualizado com sucesso!", "success")

      // Reload page to reflect changes
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error) {
      hideLoading()
      console.error("Error updating profile:", error)
      showAlert(error.message || "Erro ao atualizar perfil", "error")
    }
  })
}

// Cancel button
const cancelBtn = document.getElementById("cancelBtn")
if (cancelBtn) {
  cancelBtn.addEventListener("click", () => {
    loadUserData()
    showAlert("Alterações canceladas", "info")
  })
}

// Load user data on page load
loadUserData()
