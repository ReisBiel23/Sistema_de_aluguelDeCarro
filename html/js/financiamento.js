import { requireAuth, getCurrentUser, logout } from "./api.js"
import { calcularFinanciamento } from "./api.js"
import { showAlert, showLoading, hideLoading, formatCurrency } from "./utils.js"

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

// Store calculation result
let calculationResult = null

// Financiamento form handler
const financiamentoForm = document.getElementById("financiamentoForm")
if (financiamentoForm) {
  financiamentoForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const valorTotal = Number.parseFloat(document.getElementById("valorTotal").value)
    const entrada = Number.parseFloat(document.getElementById("entrada").value)
    const parcelas = Number.parseInt(document.getElementById("parcelas").value)
    const taxaJuros = Number.parseFloat(document.getElementById("taxaJuros").value)

    // Validation
    if (entrada > valorTotal) {
      showAlert("O valor da entrada não pode ser maior que o valor total", "error")
      return
    }

    if (entrada < valorTotal * 0.1) {
      if (!confirm("A entrada é menor que 10% do valor total. Deseja continuar?")) {
        return
      }
    }

    const valorFinanciado = valorTotal - entrada

    if (valorFinanciado <= 0) {
      showAlert("O valor a financiar deve ser maior que zero", "error")
      return
    }

    const financiamentoData = {
      valorTotal,
      entrada,
      valorFinanciado,
      parcelas,
      taxaJuros,
    }

    try {
      showLoading()

      // Try to call backend API
      try {
        calculationResult = await calcularFinanciamento(financiamentoData)
      } catch (apiError) {
        // If API fails, calculate locally
        console.log("API unavailable, calculating locally")
        calculationResult = calculateLocally(financiamentoData)
      }

      hideLoading()
      displayResult(calculationResult)
    } catch (error) {
      hideLoading()
      console.error("Error calculating financing:", error)
      showAlert(error.message || "Erro ao calcular financiamento", "error")
    }
  })
}

// Local calculation fallback
function calculateLocally(data) {
  const { valorFinanciado, parcelas, taxaJuros } = data

  // Convert annual rate to monthly
  const taxaMensal = taxaJuros / 12 / 100

  // Calculate monthly payment using Price formula
  const valorParcela =
    (valorFinanciado * taxaMensal * Math.pow(1 + taxaMensal, parcelas)) / (Math.pow(1 + taxaMensal, parcelas) - 1)

  const valorTotal = valorParcela * parcelas
  const jurosTotal = valorTotal - valorFinanciado

  return {
    valorFinanciado,
    parcelas,
    taxaJuros,
    taxaMensal: taxaMensal * 100,
    valorParcela,
    valorTotal,
    jurosTotal,
  }
}

// Display calculation result
function displayResult(result) {
  const resultadoCard = document.getElementById("resultadoCard")
  const resultadoContent = document.getElementById("resultadoContent")

  if (!result) return

  resultadoContent.innerHTML = `
    <div class="stat-card mb-md">
      <div class="stat-label">Valor Financiado</div>
      <div class="stat-value" style="font-size: var(--font-size-2xl)">
        ${formatCurrency(result.valorFinanciado)}
      </div>
    </div>

    <div class="grid grid-cols-2 mb-lg">
      <div class="stat-card">
        <div class="stat-label">Valor da Parcela</div>
        <div class="stat-value" style="font-size: var(--font-size-xl); color: var(--color-primary)">
          ${formatCurrency(result.valorParcela)}
        </div>
        <div class="text-muted" style="font-size: var(--font-size-sm)">
          ${result.parcelas}x
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Total de Juros</div>
        <div class="stat-value" style="font-size: var(--font-size-xl); color: var(--color-warning)">
          ${formatCurrency(result.jurosTotal)}
        </div>
        <div class="text-muted" style="font-size: var(--font-size-sm)">
          ${((result.jurosTotal / result.valorFinanciado) * 100).toFixed(1)}% do valor financiado
        </div>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Valor Total a Pagar</label>
      <p class="text-secondary" style="font-size: var(--font-size-lg); font-weight: 600">
        ${formatCurrency(result.valorTotal)}
      </p>
    </div>

    <div class="form-group">
      <label class="form-label">Taxa de Juros</label>
      <p class="text-secondary">
        ${result.taxaJuros.toFixed(2)}% ao ano (${result.taxaMensal.toFixed(2)}% ao mês)
      </p>
    </div>

    <div class="form-group">
      <label class="form-label">Prazo</label>
      <p class="text-secondary">${result.parcelas} meses</p>
    </div>
  `

  resultadoCard.style.display = "block"

  // Scroll to result
  resultadoCard.scrollIntoView({ behavior: "smooth", block: "nearest" })
}

// Nova simulação button
const novaSimulacaoBtn = document.getElementById("novaSimulacaoBtn")
if (novaSimulacaoBtn) {
  novaSimulacaoBtn.addEventListener("click", () => {
    document.getElementById("resultadoCard").style.display = "none"
    financiamentoForm.reset()
    document.getElementById("taxaJuros").value = "12.5"
    calculationResult = null
    window.scrollTo({ top: 0, behavior: "smooth" })
  })
}

// Solicitar financiamento button
const solicitarFinanciamentoBtn = document.getElementById("solicitarFinanciamentoBtn")
if (solicitarFinanciamentoBtn) {
  solicitarFinanciamentoBtn.addEventListener("click", () => {
    if (!calculationResult) {
      showAlert("Por favor, calcule o financiamento primeiro", "error")
      return
    }

    showAlert("Solicitação de financiamento enviada! Nossa equipe entrará em contato em breve.", "success")

    // In a real implementation, this would send the financing request to the backend
    setTimeout(() => {
      window.location.href = "/pedidos.html"
    }, 2000)
  })
}

// Auto-calculate entrada percentage
const valorTotalInput = document.getElementById("valorTotal")
const entradaInput = document.getElementById("entrada")

if (valorTotalInput && entradaInput) {
  valorTotalInput.addEventListener("input", () => {
    const valorTotal = Number.parseFloat(valorTotalInput.value)
    if (valorTotal && !entradaInput.value) {
      // Suggest 20% as entrada
      entradaInput.value = (valorTotal * 0.2).toFixed(2)
    }
  })
}
