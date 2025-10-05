
function verificarTipoUsuario(tipo) {
  
  return true 
}

function obterUsuarioAtual() {
 
  return { nome: "Admin User" } 
}

function obterCarros() {
 
  return [] 
}

function obterReservas() {
  
  return [] 
}

function obterClientes() {
  
  return [] 
}

function obterPagamentos() {

  return [] 
}

function formatarMoeda(valor) {
  
  return valor.toFixed(2) 
}

function gerarId(carros) {
  // Implementation of gerarId
  return carros.length + 1 
}

function salvarCarros(carros) {
  
}

function formatarData(data) {

  return new Date(data).toLocaleDateString() 
}

// Verificar autenticação ao carregar a página
window.addEventListener("DOMContentLoaded", () => {
  if (!verificarTipoUsuario("admin")) return

  const usuario = obterUsuarioAtual()
  document.getElementById("nomeUsuario").textContent = usuario.nome

  carregarEstatisticas()
  carregarListaCarros()
  carregarTodasReservas()

  // Form de carro
  document.getElementById("carroForm").addEventListener("submit", salvarCarro)
})

function carregarEstatisticas() {
  const carros = obterCarros()
  const reservas = obterReservas()
  const clientes = obterClientes().filter((c) => c.tipo === "cliente")
  const pagamentos = obterPagamentos()

  const receitaTotal = pagamentos.reduce((total, p) => total + p.valor, 0)

  document.getElementById("totalCarros").textContent = carros.length
  document.getElementById("totalReservas").textContent = reservas.length
  document.getElementById("totalClientes").textContent = clientes.length
  document.getElementById("receitaTotal").textContent = "R$ " + formatarMoeda(receitaTotal)
}

function mostrarFormularioCarro() {
  document.getElementById("formCarro").style.display = "block"
  document.getElementById("tituloForm").textContent = "Adicionar Novo Carro"
  document.getElementById("carroForm").reset()
  document.getElementById("carroId").value = ""
}

function cancelarFormulario() {
  document.getElementById("formCarro").style.display = "none"
  document.getElementById("carroForm").reset()
}

function salvarCarro(e) {
  e.preventDefault()

  const carros = obterCarros()
  const carroId = document.getElementById("carroId").value

  const dadosCarro = {
    modelo: document.getElementById("modelo").value,
    marca: document.getElementById("marca").value,
    ano: Number.parseInt(document.getElementById("ano").value),
    precoDiaria: Number.parseFloat(document.getElementById("precoDiaria").value),
    categoria: document.getElementById("categoria").value,
    imagem: document.getElementById("imagem").value,
    status: "disponivel",
  }

  if (carroId) {
    // Editar carro existente
    const carro = carros.find((c) => c.id === Number.parseInt(carroId))
    Object.assign(carro, dadosCarro)
    mostrarAlerta("Carro atualizado com sucesso!", "success")
  } else {
    // Adicionar novo carro
    const novoCarro = {
      id: gerarId(carros),
      ...dadosCarro,
    }
    carros.push(novoCarro)
    mostrarAlerta("Carro adicionado com sucesso!", "success")
  }

  salvarCarros(carros)
  cancelarFormulario()
  carregarListaCarros()
  carregarEstatisticas()
}

function carregarListaCarros() {
  const carros = obterCarros()
  const container = document.getElementById("listaCarros")

  if (carros.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🚗</div>
                <p>Nenhum carro cadastrado</p>
            </div>
        `
    return
  }

  container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Modelo</th>
                    <th>Marca</th>
                    <th>Ano</th>
                    <th>Categoria</th>
                    <th>Preço/Dia</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${carros
                  .map(
                    (carro) => `
                    <tr>
                        <td>${carro.modelo}</td>
                        <td>${carro.marca}</td>
                        <td>${carro.ano}</td>
                        <td>${carro.categoria}</td>
                        <td>R$ ${formatarMoeda(carro.precoDiaria)}</td>
                        <td><span class="car-badge badge-${carro.status}">${carro.status.toUpperCase()}</span></td>
                        <td class="actions">
                            <button onclick="editarCarro(${carro.id})" class="btn btn-primary btn-sm">Editar</button>
                            <button onclick="excluirCarro(${carro.id})" class="btn btn-danger btn-sm">Excluir</button>
                        </td>
                    </tr>
                `,
                  )
                  .join("")}
            </tbody>
        </table>
    `
}

function editarCarro(carroId) {
  const carros = obterCarros()
  const carro = carros.find((c) => c.id === carroId)

  document.getElementById("carroId").value = carro.id
  document.getElementById("modelo").value = carro.modelo
  document.getElementById("marca").value = carro.marca
  document.getElementById("ano").value = carro.ano
  document.getElementById("precoDiaria").value = carro.precoDiaria
  document.getElementById("categoria").value = carro.categoria
  document.getElementById("imagem").value = carro.imagem

  document.getElementById("tituloForm").textContent = "Editar Carro"
  document.getElementById("formCarro").style.display = "block"

  // Scroll para o formulário
  document.getElementById("formCarro").scrollIntoView({ behavior: "smooth" })
}

function excluirCarro(carroId) {
  if (!confirm("Tem certeza que deseja excluir este carro?")) return

  // Verificar se há reservas ativas
  const reservas = obterReservas()
  const reservasAtivas = reservas.filter((r) => r.idCarro === carroId && r.status !== "cancelada")

  if (reservasAtivas.length > 0) {
    mostrarAlerta("Não é possível excluir este carro pois há reservas ativas!", "error")
    return
  }

  const carros = obterCarros()
  const index = carros.findIndex((c) => c.id === carroId)
  carros.splice(index, 1)
  salvarCarros(carros)

  mostrarAlerta("Carro excluído com sucesso!", "success")
  carregarListaCarros()
  carregarEstatisticas()
}

function carregarTodasReservas() {
  const reservas = obterReservas()
  const carros = obterCarros()
  const clientes = obterClientes()
  const container = document.getElementById("todasReservas")

  if (reservas.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <p>Nenhuma reserva registrada</p>
            </div>
        `
    return
  }

  container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Cliente</th>
                    <th>Carro</th>
                    <th>Período</th>
                    <th>Valor</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${reservas
                  .map((reserva) => {
                    const carro = carros.find((c) => c.id === reserva.idCarro)
                    const cliente = clientes.find((c) => c.id === reserva.idCliente)
                    return `
                        <tr>
                            <td>${cliente.nome}</td>
                            <td>${carro.marca} ${carro.modelo}</td>
                            <td>${formatarData(reserva.dataInicio)} até ${formatarData(reserva.dataFim)}</td>
                            <td>R$ ${formatarMoeda(reserva.valorTotal)}</td>
                            <td><span class="status-badge status-${reserva.status}">${reserva.status.toUpperCase()}</span></td>
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
