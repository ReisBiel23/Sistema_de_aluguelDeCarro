// Verificar autenticação ao carregar a página
window.addEventListener("DOMContentLoaded", () => {
  // Placeholder for verificarTipoUsuario function
  function verificarTipoUsuario(tipo) {
    // Implement your logic here
    return true // Example return value
  }

  // Placeholder for obterUsuarioAtual function
  function obterUsuarioAtual() {
    // Implement your logic here
    return { nome: "John Doe", creditoDisponivel: 1000 } // Example return value
  }

  // Placeholder for formatarMoeda function
  function formatarMoeda(valor) {
    // Implement your logic here
    return valor.toFixed(2) // Example return value
  }

  // Placeholder for obterCarros function
  function obterCarros() {
    // Implement your logic here
    return [
      {
        id: 1,
        marca: "Ford",
        modelo: "Mustang",
        categoria: "Esportivo",
        ano: 2020,
        precoDiaria: 200,
        status: "disponivel",
        imagem: "car1.jpg",
      },
      // Example car objects
    ] // Example return value
  }

  // Placeholder for calcularDias function
  function calcularDias(dataInicio, dataFim) {
    // Implement your logic here
    const date1 = new Date(dataInicio)
    const date2 = new Date(dataFim)
    const diffTime = Math.abs(date2 - date1)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays // Example return value
  }

  // Placeholder for obterReservas function
  function obterReservas() {
    // Implement your logic here
    return [] // Example return value
  }

  // Placeholder for gerarId function
  function gerarId(reservas) {
    
    return reservas.length + 1 // Example return value
  }

  // Placeholder for salvarReservas function
  function salvarReservas(reservas) {
    
  }

  // Placeholder for salvarCarros function
  function salvarCarros(carros) {
   
  }

  // Placeholder for obterClientes function
  function obterClientes() {
    
    return [{ id: 1, nome: "John Doe", creditoDisponivel: 1000 }] // Example return value
  }

  // Placeholder for salvarClientes function
  function salvarClientes(clientes) {
    
  }

  // Placeholder for formatarData function
  function formatarData(data) {
    
    return new Date(data).toLocaleDateString() // Example return value
  }

  // Placeholder for obterPagamentos function
  function obterPagamentos() {
    
    return [] // Example return value
  }

  // Placeholder for salvarPagamentos function
  function salvarPagamentos(pagamentos) {
    
  }

  if (!verificarTipoUsuario("cliente")) return

  const usuario = obterUsuarioAtual()
  document.getElementById("nomeUsuario").textContent = usuario.nome
  document.getElementById("creditoDisponivel").textContent = formatarMoeda(usuario.creditoDisponivel)

  carregarCarrosDisponiveis()
  carregarMinhasReservas()
  carregarHistoricoPagamentos()

  // Event listeners para filtros
  document.getElementById("buscarCarro").addEventListener("input", filtrarCarros)
  document.getElementById("filtroCategoria").addEventListener("change", filtrarCarros)
  document.getElementById("ordenar").addEventListener("change", filtrarCarros)

  // Event listeners para datas
  document.getElementById("dataInicio").addEventListener("change", calcularValorReserva)
  document.getElementById("dataFim").addEventListener("change", calcularValorReserva)

  // Definir data mínima como hoje
  const hoje = new Date().toISOString().split("T")[0]
  document.getElementById("dataInicio").min = hoje
  document.getElementById("dataFim").min = hoje

  // Form de reserva
  document.getElementById("formReserva").addEventListener("submit", confirmarReserva)
})

let carroSelecionadoGlobal = null

function carregarCarrosDisponiveis() {
  const carros = obterCarros().filter((c) => c.status === "disponivel")
  const container = document.getElementById("carrosDisponiveis")

  if (carros.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🚗</div>
                <p>Nenhum carro disponível no momento</p>
            </div>
        `
    return
  }

  container.innerHTML = carros
    .map(
      (carro) => `
        <div class="car-card" data-categoria="${carro.categoria}" data-modelo="${carro.modelo.toLowerCase()}" data-marca="${carro.marca.toLowerCase()}" data-preco="${carro.precoDiaria}">
            <img src="${carro.imagem}" alt="${carro.modelo}" class="car-image">
            <div class="car-info">
                <h3>${carro.marca} ${carro.modelo}</h3>
                <div class="car-details">
                    <span>📅 ${carro.ano}</span>
                    <span>🏷️ ${carro.categoria}</span>
                </div>
                <div class="car-price">R$ ${formatarMoeda(carro.precoDiaria)}/dia</div>
                <span class="car-badge badge-disponivel">Disponível</span>
                <button onclick="abrirModalReserva(${carro.id})" class="btn btn-primary btn-block">Reservar</button>
            </div>
        </div>
    `,
    )
    .join("")
}

function filtrarCarros() {
  const busca = document.getElementById("buscarCarro").value.toLowerCase()
  const categoria = document.getElementById("filtroCategoria").value
  const ordenacao = document.getElementById("ordenar").value

  const cards = Array.from(document.querySelectorAll(".car-card"))

  // Filtrar
  cards.forEach((card) => {
    const modelo = card.dataset.modelo
    const marca = card.dataset.marca
    const cardCategoria = card.dataset.categoria

    const matchBusca = modelo.includes(busca) || marca.includes(busca)
    const matchCategoria = !categoria || cardCategoria === categoria

    if (matchBusca && matchCategoria) {
      card.style.display = "block"
    } else {
      card.style.display = "none"
    }
  })

  // Ordenar
  const container = document.getElementById("carrosDisponiveis")
  const cardsVisiveis = cards.filter((card) => card.style.display !== "none")

  if (ordenacao === "preco-asc") {
    cardsVisiveis.sort((a, b) => Number.parseFloat(a.dataset.preco) - Number.parseFloat(b.dataset.preco))
  } else if (ordenacao === "preco-desc") {
    cardsVisiveis.sort((a, b) => Number.parseFloat(b.dataset.preco) - Number.parseFloat(a.dataset.preco))
  } else {
    cardsVisiveis.sort((a, b) => a.dataset.modelo.localeCompare(b.dataset.modelo))
  }

  cardsVisiveis.forEach((card) => container.appendChild(card))
}

function abrirModalReserva(carroId) {
  const carros = obterCarros()
  const carro = carros.find((c) => c.id === carroId)
  carroSelecionadoGlobal = carro

  document.getElementById("carroSelecionado").innerHTML = `
        <div style="background: var(--light-bg); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3>${carro.marca} ${carro.modelo}</h3>
            <p>Categoria: ${carro.categoria} | Ano: ${carro.ano}</p>
            <p style="font-size: 1.2rem; color: var(--success-color); font-weight: bold;">R$ ${formatarMoeda(carro.precoDiaria)}/dia</p>
        </div>
    `

  // Limpar campos
  document.getElementById("dataInicio").value = ""
  document.getElementById("dataFim").value = ""
  document.getElementById("valorTotal").textContent = "0"
  document.getElementById("diasReserva").textContent = ""

  document.getElementById("modalReserva").style.display = "block"
}

function fecharModal() {
  document.getElementById("modalReserva").style.display = "none"
  carroSelecionadoGlobal = null
}

function calcularValorReserva() {
  const dataInicio = document.getElementById("dataInicio").value
  const dataFim = document.getElementById("dataFim").value

  if (!dataInicio || !dataFim || !carroSelecionadoGlobal) return

  const dias = calcularDias(dataInicio, dataFim)

  if (dias <= 0) {
    document.getElementById("valorTotal").textContent = "0"
    document.getElementById("diasReserva").textContent = "Data de fim deve ser posterior à data de início"
    return
  }

  const valorTotal = dias * carroSelecionadoGlobal.precoDiaria
  document.getElementById("valorTotal").textContent = formatarMoeda(valorTotal)
  document.getElementById("diasReserva").textContent = `${dias} dia(s) de aluguel`
}

function confirmarReserva(e) {
  e.preventDefault()

  const dataInicio = document.getElementById("dataInicio").value
  const dataFim = document.getElementById("dataFim").value
  const dias = calcularDias(dataInicio, dataFim)
  const valorTotal = dias * carroSelecionadoGlobal.precoDiaria

  const usuario = obterUsuarioAtual()

  // Verificar crédito disponível
  if (valorTotal > usuario.creditoDisponivel) {
    mostrarAlerta(
      "Crédito insuficiente! Você precisa de R$ " +
        formatarMoeda(valorTotal) +
        " mas tem apenas R$ " +
        formatarMoeda(usuario.creditoDisponivel),
      "error",
    )
    return
  }

  // Criar reserva
  const reservas = obterReservas()
  const novaReserva = {
    id: gerarId(reservas),
    idCliente: usuario.id,
    idCarro: carroSelecionadoGlobal.id,
    dataInicio: dataInicio,
    dataFim: dataFim,
    valorTotal: valorTotal,
    status: "pendente",
    dataCriacao: new Date().toISOString(),
  }

  reservas.push(novaReserva)
  salvarReservas(reservas)

  // Atualizar status do carro
  const carros = obterCarros()
  const carro = carros.find((c) => c.id === carroSelecionadoGlobal.id)
  carro.status = "reservado"
  salvarCarros(carros)

  // Deduzir crédito
  const clientes = obterClientes()
  const cliente = clientes.find((c) => c.id === usuario.id)
  cliente.creditoDisponivel -= valorTotal
  salvarClientes(clientes)

  mostrarAlerta("Reserva realizada com sucesso!", "success")
  fecharModal()

  // Recarregar dados
  setTimeout(() => {
    location.reload()
  }, 1500)
}

function carregarMinhasReservas() {
  const usuario = obterUsuarioAtual()
  const reservas = obterReservas().filter((r) => r.idCliente === usuario.id)
  const carros = obterCarros()
  const container = document.getElementById("minhasReservas")

  if (reservas.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <p>Você ainda não tem reservas</p>
            </div>
        `
    return
  }

  container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Carro</th>
                    <th>Período</th>
                    <th>Valor</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${reservas
                  .map((reserva) => {
                    const carro = carros.find((c) => c.id === reserva.idCarro)
                    return `
                        <tr>
                            <td>${carro.marca} ${carro.modelo}</td>
                            <td>${formatarData(reserva.dataInicio)} até ${formatarData(reserva.dataFim)}</td>
                            <td>R$ ${formatarMoeda(reserva.valorTotal)}</td>
                            <td><span class="status-badge status-${reserva.status}">${reserva.status.toUpperCase()}</span></td>
                            <td class="actions">
                                ${
                                  reserva.status === "pendente"
                                    ? `
                                    <button onclick="pagarReserva(${reserva.id})" class="btn btn-success btn-sm">Pagar</button>
                                    <button onclick="cancelarReserva(${reserva.id})" class="btn btn-danger btn-sm">Cancelar</button>
                                `
                                    : ""
                                }
                            </td>
                        </tr>
                    `
                  })
                  .join("")}
            </tbody>
        </table>
    `
}

function pagarReserva(reservaId) {
  if (!confirm("Confirmar pagamento desta reserva?")) return

  const btn = event.target
  btn.disabled = true
  btn.innerHTML = '<span class="loading"></span> Processando...'

  setTimeout(() => {
    const reservas = obterReservas()
    const reserva = reservas.find((r) => r.id === reservaId)
    reserva.status = "confirmada"
    salvarReservas(reservas)

    // Criar pagamento
    const pagamentos = obterPagamentos()
    const novoPagamento = {
      id: gerarId(pagamentos),
      idReserva: reservaId,
      idCliente: reserva.idCliente,
      valor: reserva.valorTotal,
      dataPagamento: new Date().toISOString().split("T")[0],
      status: "pago",
      metodoPagamento: "credito",
    }

    pagamentos.push(novoPagamento)
    salvarPagamentos(pagamentos)

    mostrarAlerta("Pagamento realizado com sucesso!", "success")

    setTimeout(() => {
      location.reload()
    }, 1500)
  }, 2000)
}

function cancelarReserva(reservaId) {
  if (!confirm("Tem certeza que deseja cancelar esta reserva?")) return

  const reservas = obterReservas()
  const reserva = reservas.find((r) => r.id === reservaId)
  reserva.status = "cancelada"
  salvarReservas(reservas)

  // Devolver crédito
  const clientes = obterClientes()
  const cliente = clientes.find((c) => c.id === reserva.idCliente)
  cliente.creditoDisponivel += reserva.valorTotal
  salvarClientes(clientes)

  // Liberar carro
  const carros = obterCarros()
  const carro = carros.find((c) => c.id === reserva.idCarro)
  carro.status = "disponivel"
  salvarCarros(carros)

  mostrarAlerta("Reserva cancelada com sucesso!", "success")

  setTimeout(() => {
    location.reload()
  }, 1500)
}

function carregarHistoricoPagamentos() {
  const usuario = obterUsuarioAtual()
  const pagamentos = obterPagamentos().filter((p) => p.idCliente === usuario.id)
  const reservas = obterReservas()
  const carros = obterCarros()
  const container = document.getElementById("historicoPagamentos")

  if (pagamentos.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">💳</div>
                <p>Nenhum pagamento realizado ainda</p>
            </div>
        `
    return
  }

  container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Carro</th>
                    <th>Valor</th>
                    <th>Método</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${pagamentos
                  .map((pagamento) => {
                    const reserva = reservas.find((r) => r.id === pagamento.idReserva)
                    const carro = carros.find((c) => c.id === reserva.idCarro)
                    return `
                        <tr>
                            <td>${formatarData(pagamento.dataPagamento)}</td>
                            <td>${carro.marca} ${carro.modelo}</td>
                            <td>R$ ${formatarMoeda(pagamento.valor)}</td>
                            <td>${pagamento.metodoPagamento.toUpperCase()}</td>
                            <td><span class="status-badge status-${pagamento.status}">${pagamento.status.toUpperCase()}</span></td>
                        </tr>
                    `
                  })
                  .join("")}
            </tbody>
        </table>
    `
}

function mostrarAlerta(mensagem, tipo) {
  const alert = document.getElementById("alert")
  alert.textContent = mensagem
  alert.className = `alert alert-${tipo}`
  alert.style.display = "block"

  setTimeout(() => {
    alert.style.display = "none"
  }, 5000)
}

// Fechar modal ao clicar fora
window.onclick = (event) => {
  const modal = document.getElementById("modalReserva")
  if (event.target === modal) {
    fecharModal()
  }
}
