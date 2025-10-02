
function verificarAdmin() {
  
  return true 
}

if (!verificarAdmin()) {
  window.location.href = "/login" 
}

const tabBtns = document.querySelectorAll(".tab-btn")
const tabContents = document.querySelectorAll(".tab-content")


tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const tabName = btn.dataset.tab

    tabBtns.forEach((b) => b.classList.remove("active"))
    tabContents.forEach((c) => c.classList.remove("active"))

    btn.classList.add("active")
    document.getElementById(tabName).classList.add("active")
  })
})


function carregarClientes() {
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]")
  const clientes = usuarios.filter((u) => u.tipo !== "admin")
  const tbody = document.getElementById("clientesTableBody")

  tbody.innerHTML = ""

  clientes.forEach((cliente) => {
    const tr = document.createElement("tr")
    tr.innerHTML = `
            <td>${cliente.nome}</td>
            <td>${cliente.email}</td>
            <td>${cliente.telefone}</td>
            <td>
                <button class="btn-excluir" onclick="excluirCliente(${cliente.id})">Excluir</button>
            </td>
        `
    tbody.appendChild(tr)
  })
}

function carregarCarros() {
  const carros = JSON.parse(localStorage.getItem("carros") || "[]")
  const tbody = document.getElementById("carrosTableBody")

  tbody.innerHTML = ""

  carros.forEach((carro) => {
    const tr = document.createElement("tr")
    tr.innerHTML = `
            <td>${carro.modelo}</td>
            <td>${carro.categoria}</td>
            <td>R$ ${carro.preco}</td>
            <td>${carro.disponivel ? "Disponível" : "Indisponível"}</td>
            <td>
                <button class="btn-editar" onclick="editarCarro(${carro.id})">Editar</button>
                <button class="btn-excluir" onclick="excluirCarro(${carro.id})">Excluir</button>
            </td>
        `
    tbody.appendChild(tr)
  })
}

function carregarReservas() {
  const reservas = JSON.parse(localStorage.getItem("reservas") || "[]")
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]")
  const carros = JSON.parse(localStorage.getItem("carros") || "[]")
  const tbody = document.getElementById("reservasTableBody")

  tbody.innerHTML = ""

  reservas.forEach((reserva) => {
    const usuario = usuarios.find((u) => u.id === reserva.usuarioId)
    const carro = carros.find((c) => c.id === reserva.carroId)

    const tr = document.createElement("tr")
    tr.innerHTML = `
            <td>${usuario ? usuario.nome : "N/A"}</td>
            <td>${carro ? carro.modelo : "N/A"}</td>
            <td>${new Date(reserva.dataRetirada).toLocaleDateString("pt-BR")}</td>
            <td>${new Date(reserva.dataDevolucao).toLocaleDateString("pt-BR")}</td>
            <td><span class="status-badge status-${reserva.status}">${reserva.status.toUpperCase()}</span></td>
            <td>
                ${reserva.status === "pendente" ? `<button class="btn-aprovar" onclick="aprovarReserva(${reserva.id})">Aprovar</button>` : ""}
                <button class="btn-excluir" onclick="cancelarReservaAdmin(${reserva.id})">Cancelar</button>
            </td>
        `
    tbody.appendChild(tr)
  })
}

function carregarRelatorios() {
  const reservas = JSON.parse(localStorage.getItem("reservas") || "[]")
  const carros = JSON.parse(localStorage.getItem("carros") || "[]")
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]")

  // Carros mais alugados
  const carrosCount = {}
  reservas.forEach((r) => {
    carrosCount[r.carroId] = (carrosCount[r.carroId] || 0) + 1
  })

  const carrosMaisAlugados = Object.entries(carrosCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([carroId, count]) => {
      const carro = carros.find((c) => c.id === Number.parseInt(carroId))
      return `<div class="relatorio-item"><span>${carro ? carro.modelo : "N/A"}</span><span>${count} reservas</span></div>`
    })
    .join("")

  document.getElementById("carrosMaisAlugados").innerHTML = carrosMaisAlugados || "<p>Sem dados</p>"

  // Clientes mais ativos
  const clientesCount = {}
  reservas.forEach((r) => {
    clientesCount[r.usuarioId] = (clientesCount[r.usuarioId] || 0) + 1
  })

  const clientesMaisAtivos = Object.entries(clientesCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([usuarioId, count]) => {
      const usuario = usuarios.find((u) => u.id === Number.parseInt(usuarioId))
      return `<div class="relatorio-item"><span>${usuario ? usuario.nome : "N/A"}</span><span>${count} reservas</span></div>`
    })
    .join("")

  document.getElementById("clientesMaisAtivos").innerHTML = clientesMaisAtivos || "<p>Sem dados</p>"

  
  const faturamentoTotal = reservas
    .filter((r) => r.status === "confirmada" || r.status === "concluida")
    .reduce((total, r) => {
      const valor = Number.parseFloat(r.total.replace("R$", "").replace(",", "."))
      return total + valor
    }, 0)

  document.getElementById("faturamentoMensal").innerHTML = `
        <div class="relatorio-item"><span>Total:</span><span>R$ ${faturamentoTotal.toFixed(2)}</span></div>
        <div class="relatorio-item"><span>Reservas:</span><span>${reservas.length}</span></div>
    `
}

window.excluirCliente = (id) => {
  if (confirm("Tem certeza que deseja excluir este cliente?")) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]")
    const novosUsuarios = usuarios.filter((u) => u.id !== id)
    localStorage.setItem("usuarios", JSON.stringify(novosUsuarios))
    carregarClientes()
  }
}

window.excluirCarro = (id) => {
  if (confirm("Tem certeza que deseja excluir este carro?")) {
    const carros = JSON.parse(localStorage.getItem("carros") || "[]")
    const novosCarros = carros.filter((c) => c.id !== id)
    localStorage.setItem("carros", JSON.stringify(novosCarros))
    carregarCarros()
  }
}

window.editarCarro = (id) => {
  const carros = JSON.parse(localStorage.getItem("carros") || "[]")
  const carro = carros.find((c) => c.id === id)

  if (carro) {
    const novoPreco = prompt(`Editar preço do ${carro.modelo}:`, carro.preco)
    if (novoPreco && !isNaN(novoPreco)) {
      carro.preco = Number.parseFloat(novoPreco)
      localStorage.setItem("carros", JSON.stringify(carros))
      carregarCarros()
    }
  }
}

window.aprovarReserva = (id) => {
  const reservas = JSON.parse(localStorage.getItem("reservas") || "[]")
  const reserva = reservas.find((r) => r.id === id)

  if (reserva) {
    reserva.status = "confirmada"
    localStorage.setItem("reservas", JSON.stringify(reservas))
    carregarReservas()
  }
}

window.cancelarReservaAdmin = (id) => {
  if (confirm("Tem certeza que deseja cancelar esta reserva?")) {
    const reservas = JSON.parse(localStorage.getItem("reservas") || "[]")
    const reserva = reservas.find((r) => r.id === id)

    if (reserva) {
      reserva.status = "cancelada"
      localStorage.setItem("reservas", JSON.stringify(reservas))
      carregarReservas()
    }
  }
}

document.getElementById("adicionarCarro").addEventListener("click", () => {
  const modal = document.getElementById("modal")
  const modalContent = document.getElementById("modalContent")

  modalContent.innerHTML = `
        <h2>Adicionar Novo Carro</h2>
        <form id="adicionarCarroForm">
            <div class="form-group">
                <label>Modelo:</label>
                <input type="text" id="modelo" required>
            </div>
            <div class="form-group">
                <label>Categoria:</label>
                <select id="categoria" required>
                    <option value="Econômico">Econômico</option>
                    <option value="SUV">SUV</option>
                    <option value="Luxo">Luxo</option>
                    <option value="Esportivo">Esportivo</option>
                </select>
            </div>
            <div class="form-group">
                <label>Ano:</label>
                <input type="number" id="ano" value="2024" required>
            </div>
            <div class="form-group">
                <label>Preço/Dia:</label>
                <input type="number" id="preco" required>
            </div>
            <div class="form-group">
                <label>Descrição:</label>
                <textarea id="descricao" required></textarea>
            </div>
            <button type="submit" class="btn-primary">Adicionar</button>
        </form>
    `

  modal.style.display = "block"

  document.getElementById("adicionarCarroForm").addEventListener("submit", (e) => {
    e.preventDefault()

    const carros = JSON.parse(localStorage.getItem("carros") || "[]")
    const novoCarro = {
      id: Date.now(),
      modelo: document.getElementById("modelo").value,
      categoria: document.getElementById("categoria").value,
      ano: Number.parseInt(document.getElementById("ano").value),
      preco: Number.parseFloat(document.getElementById("preco").value),
      descricao: document.getElementById("descricao").value,
      imagem: "/classic-red-convertible.png",
      disponivel: true,
    }

    carros.push(novoCarro)
    localStorage.setItem("carros", JSON.stringify(carros))

    modal.style.display = "none"
    carregarCarros()
    alert("Carro adicionado com sucesso!")
  })
})


carregarClientes()
carregarCarros()
carregarReservas()
carregarRelatorios()
