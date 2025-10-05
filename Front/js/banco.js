// Verificar autenticação ao carregar a página
window.addEventListener("DOMContentLoaded", () => {
  if (!verificarTipoUsuario("banco")) return

  const usuario = obterUsuarioAtual()
  document.getElementById("nomeUsuario").textContent = usuario.nome

  carregarListaClientes()
  carregarHistoricoPagamentos()

  // Form de crédito
  document.getElementById("formCredito").addEventListener("submit", atualizarCredito)
})

function carregarListaClientes() {
  const clientes = obterClientes().filter((c) => c.tipo === "cliente")
  const container = document.getElementById("listaClientes")

  if (clientes.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">👥</div>
                <p>Nenhum cliente cadastrado</p>
            </div>
        `
    return
  }

  container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Limite de Crédito</th>
                    <th>Crédito Disponível</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${clientes
                  .map(
                    (cliente) => `
                    <tr>
                        <td>${cliente.nome}</td>
                        <td>${cliente.email}</td>
                        <td>R$ ${formatarMoeda(cliente.limiteCredito)}</td>
                        <td>R$ ${formatarMoeda(cliente.creditoDisponivel)}</td>
                        <td><span class="status-badge status-${cliente.status}">${cliente.status.toUpperCase()}</span></td>
                        <td class="actions">
                            <button onclick="abrirModalCredito(${cliente.id})" class="btn btn-primary btn-sm">Ajustar Crédito</button>
                            ${
                              cliente.status === "ativo"
                                ? `<button onclick="bloquearCliente(${cliente.id})" class="btn btn-danger btn-sm">Bloquear</button>`
                                : `<button onclick="desbloquearCliente(${cliente.id})" class="btn btn-success btn-sm">Desbloquear</button>`
                            }
                        </td>
                    </tr>
                `,
                  )
                  .join("")}
            </tbody>
        </table>
    `
}

function abrirModalCredito(clienteId) {
  const clientes = obterClientes()
  const cliente = clientes.find((c) => c.id === clienteId)

  document.getElementById("clienteId").value = cliente.id
  document.getElementById("novoLimite").value = cliente.limiteCredito

  document.getElementById("clienteSelecionado").innerHTML = `
        <div style="background: var(--light-bg); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3>${cliente.nome}</h3>
            <p>Email: ${cliente.email}</p>
            <p>Limite Atual: R$ ${formatarMoeda(cliente.limiteCredito)}</p>
            <p>Disponível: R$ ${formatarMoeda(cliente.creditoDisponivel)}</p>
        </div>
    `

  document.getElementById("modalCredito").style.display = "block"
}

function fecharModal() {
  document.getElementById("modalCredito").style.display = "none"
}

function atualizarCredito(e) {
  e.preventDefault()

  const clienteId = Number.parseInt(document.getElementById("clienteId").value)
  const novoLimite = Number.parseFloat(document.getElementById("novoLimite").value)

  const clientes = obterClientes()
  const cliente = clientes.find((c) => c.id === clienteId)

  const limiteAntigo = cliente.limiteCredito
  const creditoUsado = limiteAntigo - cliente.creditoDisponivel

  cliente.limiteCredito = novoLimite
  cliente.creditoDisponivel = novoLimite - creditoUsado

  salvarClientes(clientes)

  mostrarAlerta("Limite de crédito atualizado com sucesso!", "success")
  fecharModal()
  carregarListaClientes()
}

function bloquearCliente(clienteId) {
  if (!confirm("Tem certeza que deseja bloquear este cliente?")) return

  const clientes = obterClientes()
  const cliente = clientes.find((c) => c.id === clienteId)
  cliente.status = "bloqueado"
  salvarClientes(clientes)

  mostrarAlerta("Cliente bloqueado com sucesso!", "success")
  carregarListaClientes()
}

function desbloquearCliente(clienteId) {
  if (!confirm("Tem certeza que deseja desbloquear este cliente?")) return

  const clientes = obterClientes()
  const cliente = clientes.find((c) => c.id === clienteId)
  cliente.status = "ativo"
  salvarClientes(clientes)

  mostrarAlerta("Cliente desbloqueado com sucesso!", "success")
  carregarListaClientes()
}

function carregarHistoricoPagamentos() {
  const pagamentos = obterPagamentos()
  const clientes = obterClientes()
  const reservas = obterReservas()
  const carros = obterCarros()
  const container = document.getElementById("historicoPagamentos")

  if (pagamentos.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">💳</div>
                <p>Nenhum pagamento registrado</p>
            </div>
        `
    return
  }

  container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Cliente</th>
                    <th>Carro</th>
                    <th>Valor</th>
                    <th>Método</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${pagamentos
                  .map((pagamento) => {
                    const cliente = clientes.find((c) => c.id === pagamento.idCliente)
                    const reserva = reservas.find((r) => r.id === pagamento.idReserva)
                    const carro = carros.find((c) => c.id === reserva.idCarro)
                    return `
                        <tr>
                            <td>${formatarData(pagamento.dataPagamento)}</td>
                            <td>${cliente.nome}</td>
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
  const modal = document.getElementById("modalCredito")
  if (event.target === modal) {
    fecharModal()
  }
}

// Declare the formatarMoeda function here
function formatarMoeda(valor) {
  return valor.toFixed(2).replace(".", ",")
}

// Declare the formatarData function here
function formatarData(data) {
  const date = new Date(data)
  return date.toLocaleDateString("pt-BR")
}

// Declare the verificarTipoUsuario function here
function verificarTipoUsuario(tipo) {
  const usuario = obterUsuarioAtual()
  return usuario && usuario.tipo === tipo
}

// Declare the obterUsuarioAtual function here
function obterUsuarioAtual() {
  return JSON.parse(localStorage.getItem("usuario"))
}

// Declare the obterClientes function here
function obterClientes() {
  return JSON.parse(localStorage.getItem("clientes")) || []
}

// Declare the salvarClientes function here
function salvarClientes(clientes) {
  localStorage.setItem("clientes", JSON.stringify(clientes))
}

// Declare the obterPagamentos function here
function obterPagamentos() {
  return JSON.parse(localStorage.getItem("pagamentos")) || []
}

// Declare the obterReservas function here
function obterReservas() {
  return JSON.parse(localStorage.getItem("reservas")) || []
}

// Declare the obterCarros function here
function obterCarros() {
  return JSON.parse(localStorage.getItem("carros")) || []
}
