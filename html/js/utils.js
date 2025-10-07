// Utility Functions

// Show loading overlay
export function showLoading() {
  const overlay = document.createElement("div")
  overlay.className = "loading-overlay"
  overlay.id = "loadingOverlay"
  overlay.innerHTML = '<div class="loading-spinner"></div>'
  document.body.appendChild(overlay)
}

// Hide loading overlay
export function hideLoading() {
  const overlay = document.getElementById("loadingOverlay")
  if (overlay) {
    overlay.remove()
  }
}

// Show alert message
export function showAlert(message, type = "info") {
  const alertDiv = document.createElement("div")
  alertDiv.className = `alert alert-${type}`
  alertDiv.textContent = message
  alertDiv.style.position = "fixed"
  alertDiv.style.top = "20px"
  alertDiv.style.right = "20px"
  alertDiv.style.zIndex = "10000"
  alertDiv.style.minWidth = "300px"
  alertDiv.style.animation = "slideIn 0.3s ease-out"

  document.body.appendChild(alertDiv)

  setTimeout(() => {
    alertDiv.style.animation = "slideOut 0.3s ease-out"
    setTimeout(() => alertDiv.remove(), 300)
  }, 3000)
}

// Format currency
export function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

// Format date
export function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("pt-BR").format(date)
}

// Format datetime
export function formatDateTime(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date)
}

// Validate email
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Validate CPF (Brazilian tax ID)
export function validateCPF(cpf) {
  cpf = cpf.replace(/[^\d]/g, "")

  if (cpf.length !== 11) return false

  // Check if all digits are the same
  if (/^(\d)\1+$/.test(cpf)) return false

  // Validate check digits
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(cpf.charAt(i)) * (10 - i)
  }
  let digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  if (digit !== Number.parseInt(cpf.charAt(9))) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(cpf.charAt(i)) * (11 - i)
  }
  digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  if (digit !== Number.parseInt(cpf.charAt(10))) return false

  return true
}

// Format CPF
export function formatCPF(cpf) {
  cpf = cpf.replace(/[^\d]/g, "")
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
}

// Debounce function
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Get status badge class
export function getStatusBadgeClass(status) {
  const statusMap = {
    aprovado: "badge-success",
    em_analise: "badge-warning",
    reprovado: "badge-danger",
    pendente: "badge-warning",
    ativo: "badge-success",
    cancelado: "badge-danger",
  }
  return statusMap[status] || "badge-primary"
}

// Get status label
export function getStatusLabel(status) {
  const labelMap = {
    aprovado: "Aprovado",
    em_analise: "Em Análise",
    reprovado: "Reprovado",
    pendente: "Pendente",
    ativo: "Ativo",
    cancelado: "Cancelado",
  }
  return labelMap[status] || status
}

// Add CSS animations
const style = document.createElement("style")
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`
document.head.appendChild(style)
