// Verificar autenticação
function verificarAutenticacao() {
  // Implementação fictícia para verificar autenticação
  return true // Substitua por lógica real de autenticação
}

if (!verificarAutenticacao()) {
  // Redireciona para login se não estiver autenticado
  window.location.href = "login.html"
}

function getUsuarioLogado() {
  // Implementação fictícia para obter o usuário logado
  return { id: 1, nome: "John Doe" } // Substitua por lógica real de obtenção de usuário
}

const reservaForm = document.getElementById("reservaForm")
const carroInfo = document.getElementById("carroInfo")
const numeroDiarias = document.getElementById("numeroDiarias")
const precoDia = document.getElementById("precoDia")
const precoTotal = document.getElementById("precoTotal")
const modal = document.getElementById("modal")
const modalMessage = document.getElementById("modalMessage")
const closeModal = document.querySelector(".close")

const urlParams = new URLSearchParams(window.location.search)
const carroId = Number.parseInt(urlParams.get("id"))

let carroSelecionado = null

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

function carregarCarro() {
  const carros = JSON.parse(localStorage.getItem("carros") || "[]")
  carroSelecionado = carros.find((c) => c.id === carroId)

  if (!carroSelecionado) {
    carroInfo.innerHTML = "<p>Carro não encontrado.</p>"
    return
  }

  carroInfo.innerHTML = `
        <img src="${carroSelecionado.imagem}" alt="${carroSelecionado.modelo}" style="width: 100%; border-radius: 8px; margin-bottom: 1rem;">
        <h3>${carroSelecionado.modelo}</h3>
        <p>${carroSelecionado.categoria} - ${carroSelecionado.ano}</p>
    `

  precoDia.textContent = `R$ ${carroSelecionado.preco}`

  // Preencher nome do cliente se estiver logado
  const usuario = getUsuarioLogado()
  if (usuario) {
    document.getElementById("nomeCliente").value = usuario.nome
  }
}

function calcularTotal() {
  const dataRetirada = new Date(document.getElementById("dataRetirada").value)
  const dataDevolucao = new Date(document.getElementById("dataDevolucao").value)

  if (dataRetirada && dataDevolucao && dataDevolucao > dataRetirada) {
    const dias = Math.ceil((dataDevolucao - dataRetirada) / (1000 * 60 * 60 * 24))
    numeroDiarias.textContent = `${dias} dia(s)`

    let total = dias * carroSelecionado.preco

    // Aplicar descontos
    if (dias >= 30) {
      total *= 0.8 // 20% desconto
    } else if (dias >= 7) {
      total *= 0.9 // 10% desconto
    }

    precoTotal.textContent = `R$ ${total.toFixed(2)}`
  }
}

document.getElementById("dataRetirada").addEventListener("change", calcularTotal)
document.getElementById("dataDevolucao").addEventListener("change", calcularTotal)

reservaForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const nomeCliente = document.getElementById("nomeCliente").value.trim()
  const dataRetirada = document.getElementById("dataRetirada").value
  const dataDevolucao = document.getElementById("dataDevolucao").value
  const localRetirada = document.getElementById("localRetirada").value
  const localDevolucao = document.getElementById("localDevolucao").value
  const metodoPagamento = document.getElementById("metodoPagamento").value

  // Validações
  if (!nomeCliente || !dataRetirada || !dataDevolucao || !localRetirada || !localDevolucao || !metodoPagamento) {
    mostrarModal("Por favor, preencha todos os campos")
    return
  }

  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const retirada = new Date(dataRetirada)
  const devolucao = new Date(dataDevolucao)

  if (retirada < hoje) {
    mostrarModal("A data de retirada não pode ser no passado")
    return
  }

  if (devolucao <= retirada) {
    mostrarModal("A data de devolução deve ser posterior à data de retirada")
    return
  }

  // Simular processamento de pagamento
  const sucesso = Math.random() > 0.1 // 90% de sucesso

  if (sucesso) {
    const usuario = getUsuarioLogado()
    const reservas = JSON.parse(localStorage.getItem("reservas") || "[]")

    const novaReserva = {
      id: Date.now(),
      usuarioId: usuario.id,
      carroId: carroSelecionado.id,
      nomeCliente,
      dataRetirada,
      dataDevolucao,
      localRetirada,
      localDevolucao,
      metodoPagamento,
      total: precoTotal.textContent,
      status: "confirmada",
      dataCriacao: new Date().toISOString(),
    }

    reservas.push(novaReserva)
    localStorage.setItem("reservas", JSON.stringify(reservas))

    mostrarModal("Reserva confirmada com sucesso! Você receberá um e-mail com os detalhes.")
    setTimeout(() => {
      window.location.href = "cliente.html"
    }, 2000)
  } else {
    mostrarModal("Erro ao processar pagamento. Por favor, tente novamente.")
  }
})

carregarCarro()
