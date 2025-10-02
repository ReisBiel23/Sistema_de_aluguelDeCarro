// Verificar autenticação
function verificarAutenticacao() {
  // Implementação de verificarAutenticacao
  return true // Exemplo de retorno
}

function getUsuarioLogado() {
  // Implementação de getUsuarioLogado
  return JSON.parse(localStorage.getItem("usuarioLogado") || "{}") // Exemplo de retorno
}

const dadosCliente = document.getElementById("dadosCliente")
const reservasAtivas = document.getElementById("reservasAtivas")
const historicoReservas = document.getElementById("historicoReservas")
const modal = document.getElementById("modal")
const modalContent = document.getElementById("modalContent")
const closeModal = document.querySelector(".close")

closeModal.addEventListener("click", () => {
  modal.style.display = "none"
})

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none"
  }
})

function carregarDadosCliente() {
  const usuario = getUsuarioLogado()

  dadosCliente.innerHTML = `
        <div class="info-item">
            <span class="info-label">Nome:</span>
            <span>${usuario.nome}</span>
        </div>
        <div class="info-item">
            <span class="info-label">E-mail:</span>
            <span>${usuario.email}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Telefone:</span>
            <span>${usuario.telefone}</span>
        </div>
    `
}

function carregarReservas() {
  const usuario = getUsuarioLogado()
  const reservas = JSON.parse(localStorage.getItem("reservas") || "[]")
  const carros = JSON.parse(localStorage.getItem("carros") || "[]")

  const minhasReservas = reservas.filter((r) => r.usuarioId === usuario.id)

  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  const ativas = minhasReservas.filter((r) => {
    const dataDevolucao = new Date(r.dataDevolucao)
    return dataDevolucao >= hoje && r.status !== "cancelada"
  })

  const historico = minhasReservas.filter((r) => {
    const dataDevolucao = new Date(r.dataDevolucao)
    return dataDevolucao < hoje || r.status === "cancelada"
  })

  // Renderizar reservas ativas
  if (ativas.length === 0) {
    reservasAtivas.innerHTML = "<p>Você não possui reservas ativas.</p>"
  } else {
    reservasAtivas.innerHTML = ""
    ativas.forEach((reserva) => {
      const carro = carros.find((c) => c.id === reserva.carroId)
      const card = criarCardReserva(reserva, carro, true)
      reservasAtivas.appendChild(card)
    })
  }

  // Renderizar histórico
  if (historico.length === 0) {
    historicoReservas.innerHTML = "<p>Você ainda não possui histórico de reservas.</p>"
  } else {
    historicoReservas.innerHTML = ""
    historico.forEach((reserva) => {
      const carro = carros.find((c) => c.id === reserva.carroId)
      const card = criarCardReserva(reserva, carro, false)
      historicoReservas.appendChild(card)
    })
  }
}

function criarCardReserva(reserva, carro, podeCancelar) {
  const card = document.createElement("div")
  card.className = "reserva-card"

  const statusClass = `status-${reserva.status.toLowerCase()}`

  card.innerHTML = `
        <h3>${carro ? carro.modelo : "Carro não encontrado"}</h3>
        <div class="reserva-info">
            <p><strong>Retirada:</strong> ${new Date(reserva.dataRetirada).toLocaleDateString("pt-BR")}</p>
            <p><strong>Devolução:</strong> ${new Date(reserva.dataDevolucao).toLocaleDateString("pt-BR")}</p>
            <p><strong>Local Retirada:</strong> ${reserva.localRetirada}</p>
            <p><strong>Total:</strong> ${reserva.total}</p>
            <p><span class="status-badge ${statusClass}">${reserva.status.toUpperCase()}</span></p>
        </div>
        ${
          podeCancelar
            ? `
            <div class="reserva-acoes">
                <button class="btn-cancelar" onclick="cancelarReserva(${reserva.id})">Cancelar Reserva</button>
            </div>
        `
            : ""
        }
    `

  return card
}

function cancelarReserva(reservaId) {
  if (confirm("Tem certeza que deseja cancelar esta reserva?")) {
    const reservas = JSON.parse(localStorage.getItem("reservas") || "[]")
    const index = reservas.findIndex((r) => r.id === reservaId)

    if (index !== -1) {
      reservas[index].status = "cancelada"
      localStorage.setItem("reservas", JSON.stringify(reservas))
      carregarReservas()
      alert("Reserva cancelada com sucesso!")
    }
  }
}

// Tornar função global para uso no HTML
window.cancelarReserva = cancelarReserva

document.getElementById("editarDados").addEventListener("click", () => {
  const usuario = getUsuarioLogado()

  modalContent.innerHTML = `
        <h2>Editar Dados</h2>
        <form id="editarForm">
            <div class="form-group">
                <label>Nome:</label>
                <input type="text" id="editNome" value="${usuario.nome}" required>
            </div>
            <div class="form-group">
                <label>Telefone:</label>
                <input type="tel" id="editTelefone" value="${usuario.telefone}" required>
            </div>
            <button type="submit" class="btn-primary">Salvar</button>
        </form>
    `

  modal.style.display = "block"

  document.getElementById("editarForm").addEventListener("submit", (e) => {
    e.preventDefault()

    const novoNome = document.getElementById("editNome").value.trim()
    const novoTelefone = document.getElementById("editTelefone").value.trim()

    if (!novoNome || !novoTelefone) {
      alert("Preencha todos os campos")
      return
    }

    // Atualizar no localStorage
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]")
    const index = usuarios.findIndex((u) => u.id === usuario.id)

    if (index !== -1) {
      usuarios[index].nome = novoNome
      usuarios[index].telefone = novoTelefone
      localStorage.setItem("usuarios", JSON.stringify(usuarios))

      // Atualizar usuário logado
      usuario.nome = novoNome
      usuario.telefone = novoTelefone
      localStorage.setItem("usuarioLogado", JSON.stringify(usuario))

      modal.style.display = "none"
      carregarDadosCliente()
      alert("Dados atualizados com sucesso!")
    }
  })
})

carregarDadosCliente()
carregarReservas()
