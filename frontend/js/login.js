const loginForm = document.getElementById("loginForm")
const modal = document.getElementById("modal")
const modalMessage = document.getElementById("modalMessage")
const closeModal = document.querySelector(".close")

function login(email, senha) {
  // Simulação de login
  if (email === "admin@example.com" && senha === "admin123") {
    return { sucesso: true, usuario: { tipo: "admin" } }
  } else if (email === "cliente@example.com" && senha === "cliente123") {
    return { sucesso: true, usuario: { tipo: "cliente" } }
  } else {
    return { sucesso: false, mensagem: "Email ou senha inválidos" }
  }
}

closeModal.addEventListener("click", () => {
  modal.style.display = "none"
})

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none"
  }
})

function mostrarModal(mensagem) {
  modalMessage.textContent = mensagem
  modal.style.display = "block"
}

loginForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const email = document.getElementById("email").value.trim()
  const senha = document.getElementById("senha").value

  // Validação
  if (!email || !senha) {
    mostrarModal("Por favor, preencha todos os campos")
    return
  }

  const resultado = login(email, senha)

  if (resultado.sucesso) {
    mostrarModal("Login realizado com sucesso!")
    setTimeout(() => {
      if (resultado.usuario.tipo === "admin") {
        window.location.href = "admin.html"
      } else {
        window.location.href = "cliente.html"
      }
    }, 1500)
  } else {
    mostrarModal(resultado.mensagem)
  }
})
