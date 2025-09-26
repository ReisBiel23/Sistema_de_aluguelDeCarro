// Verificar se usuário está logado
const currentUser = JSON.parse(localStorage.getItem("currentUser"))
if (!currentUser) {
  window.location.href = "index.html"
}

// Mostrar nome do usuário
document.getElementById("userName").textContent = currentUser.name

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser")
  window.location.href = "index.html"
})

// Gerenciamento de abas
const tabBtns = document.querySelectorAll(".tab-btn")
const tabContents = document.querySelectorAll(".tab-content")

tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const tabId = btn.getAttribute("data-tab")

    // Remover classe active de todas as abas
    tabBtns.forEach((b) => b.classList.remove("active"))
    tabContents.forEach((c) => c.classList.remove("active"))

    // Adicionar classe active na aba clicada
    btn.classList.add("active")
    document.getElementById(tabId).classList.add("active")

    // Se for a aba de pedidos, carregar os pedidos
    if (tabId === "my-rentals") {
      loadRentals()
    }
  })
})

// Formulário de novo pedido
const rentalForm = document.getElementById("rentalForm")
rentalForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const formData = new FormData(rentalForm)
  const rentalData = {
    id: Date.now().toString(),
    userId: currentUser.id,
    carType: formData.get("carType"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    location: formData.get("location"),
    observations: formData.get("observations"),
    status: "pendente",
    createdAt: new Date().toISOString(),
  }

  // Salvar pedido
  const rentals = JSON.parse(localStorage.getItem("rentals")) || []
  rentals.push(rentalData)
  localStorage.setItem("rentals", JSON.stringify(rentals))

  alert("Pedido criado com sucesso!")
  rentalForm.reset()

  // Atualizar data mínima
  setMinDate()
})

// Carregar pedidos do usuário
function loadRentals() {
  const rentals = JSON.parse(localStorage.getItem("rentals")) || []
  const userRentals = rentals.filter((rental) => rental.userId === currentUser.id)

  const container = document.getElementById("rentalsContainer")

  if (userRentals.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #666;">Você ainda não possui pedidos de aluguel.</p>'
    return
  }

  container.innerHTML = userRentals
    .map(
      (rental) => `
        <div class="rental-item">
            <div class="rental-header">
                <span class="rental-id">Pedido #${rental.id}</span>
                <span class="status ${rental.status}">${rental.status}</span>
            </div>
            <div class="rental-details">
                <div><strong>Tipo:</strong> ${getCarTypeName(rental.carType)}</div>
                <div><strong>Início:</strong> ${formatDate(rental.startDate)}</div>
                <div><strong>Fim:</strong> ${formatDate(rental.endDate)}</div>
                <div><strong>Local:</strong> ${rental.location}</div>
                <div><strong>Criado em:</strong> ${formatDateTime(rental.createdAt)}</div>
                ${rental.observations ? `<div><strong>Observações:</strong> ${rental.observations}</div>` : ""}
            </div>
        </div>
    `,
    )
    .join("")
}

// Funções auxiliares
function getCarTypeName(type) {
  const types = {
    economico: "Econômico",
    compacto: "Compacto",
    sedan: "Sedan",
    suv: "SUV",
    luxo: "Luxo",
  }
  return types[type] || type
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("pt-BR")
}

function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString("pt-BR")
}

// Definir data mínima como hoje
function setMinDate() {
  const today = new Date().toISOString().split("T")[0]
  document.getElementById("startDate").min = today
  document.getElementById("endDate").min = today
}

// Validar datas
document.getElementById("startDate").addEventListener("change", (e) => {
  document.getElementById("endDate").min = e.target.value
})

// Inicializar
setMinDate()
