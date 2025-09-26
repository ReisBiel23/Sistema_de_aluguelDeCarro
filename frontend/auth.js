// Simulação de banco de dados de usuários
const users = JSON.parse(localStorage.getItem("users")) || []

// Elementos do DOM
const loginForm = document.getElementById("loginForm")
const registerForm = document.getElementById("registerForm")
const showRegisterLink = document.getElementById("showRegister")
const showLoginLink = document.getElementById("showLogin")
const loginCard = document.querySelector(".login-card")
const registerCard = document.getElementById("registerCard")
const errorMessage = document.getElementById("error-message")

// Alternar entre login e cadastro
showRegisterLink.addEventListener("click", (e) => {
  e.preventDefault()
  loginCard.style.display = "none"
  registerCard.style.display = "block"
})

showLoginLink.addEventListener("click", (e) => {
  e.preventDefault()
  registerCard.style.display = "none"
  loginCard.style.display = "block"
})

// Função para mostrar erro
function showError(message) {
  errorMessage.textContent = message
  errorMessage.style.display = "block"
  setTimeout(() => {
    errorMessage.style.display = "none"
  }, 5000)
}

// Cadastro de usuário
registerForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const formData = new FormData(registerForm)
  const userData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    id: Date.now().toString(),
  }

  // Verificar se email já existe
  if (users.find((user) => user.email === userData.email)) {
    showError("Este email já está cadastrado!")
    return
  }

  // Adicionar usuário
  users.push(userData)
  localStorage.setItem("users", JSON.stringify(users))

  alert("Cadastro realizado com sucesso! Faça login para continuar.")

  // Voltar para tela de login
  registerCard.style.display = "none"
  loginCard.style.display = "block"
  registerForm.reset()
})

// Login de usuário
loginForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const formData = new FormData(loginForm)
  const email = formData.get("email")
  const password = formData.get("password")

  // Verificar credenciais
  const user = users.find((u) => u.email === email && u.password === password)

  if (user) {
    // Salvar usuário logado
    localStorage.setItem("currentUser", JSON.stringify(user))

    // Redirecionar para dashboard
    window.location.href = "dashboard.html"
  } else {
    showError("Email ou senha incorretos!")
  }
})

// Verificar se já está logado
if (localStorage.getItem("currentUser")) {
  window.location.href = "dashboard.html"
}
