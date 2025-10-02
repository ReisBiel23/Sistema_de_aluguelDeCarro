const cadastroForm = document.getElementById("cadastroForm")
const modal = document.getElementById("modal")
const modalMessage = document.getElementById("modalMessage")
const closeModal = document.querySelector(".close")

function cadastrar(userData) {

  return { sucesso: true, mensagem: "Cadastro realizado com sucesso!" }
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

cadastroForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const nome = document.getElementById("nome").value.trim()
  const email = document.getElementById("email").value.trim()
  const telefone = document.getElementById("telefone").value.trim()
  const senha = document.getElementById("senha").value
  const confirmarSenha = document.getElementById("confirmarSenha").value

  // Validações
  if (!nome || !email || !telefone || !senha || !confirmarSenha) {
    mostrarModal("Por favor, preencha todos os campos")
    return
  }

  if (senha.length < 6) {
    mostrarModal("A senha deve ter no mínimo 6 caracteres")
    return
  }

  if (senha !== confirmarSenha) {
    mostrarModal("As senhas não coincidem")
    return
  }

  const resultado = cadastrar({ nome, email, telefone, senha })

  if (resultado.sucesso) {
    mostrarModal(resultado.mensagem)
    setTimeout(() => {
      window.location.href = "login.html"
    }, 2000)
  } else {
    mostrarModal(resultado.mensagem)
  }
})
