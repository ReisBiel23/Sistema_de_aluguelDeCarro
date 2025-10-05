// Inicializar dados no localStorage
function inicializarDados() {
  // Verificar se já existem dados
  if (!localStorage.getItem("carros")) {
    const carrosIniciais = [
      {
        id: 1,
        modelo: "Onix",
        marca: "Chevrolet",
        ano: 2023,
        precoDiaria: 120,
        categoria: "Econômico",
        status: "disponivel",
        imagem: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop",
      },
      {
        id: 2,
        modelo: "Civic",
        marca: "Honda",
        ano: 2023,
        precoDiaria: 180,
        categoria: "Sedan",
        status: "disponivel",
        imagem: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400&h=300&fit=crop",
      },
      {
        id: 3,
        modelo: "Compass",
        marca: "Jeep",
        ano: 2024,
        precoDiaria: 250,
        categoria: "SUV",
        status: "disponivel",
        imagem: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=300&fit=crop",
      },
      {
        id: 4,
        modelo: "Corolla",
        marca: "Toyota",
        ano: 2023,
        precoDiaria: 170,
        categoria: "Sedan",
        status: "disponivel",
        imagem: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop",
      },
      {
        id: 5,
        modelo: "HB20",
        marca: "Hyundai",
        ano: 2023,
        precoDiaria: 110,
        categoria: "Econômico",
        status: "disponivel",
        imagem: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop",
      },
      {
        id: 6,
        modelo: "Tiguan",
        marca: "Volkswagen",
        ano: 2024,
        precoDiaria: 280,
        categoria: "SUV",
        status: "disponivel",
        imagem: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop",
      },
      {
        id: 7,
        modelo: "A3 Sedan",
        marca: "Audi",
        ano: 2024,
        precoDiaria: 350,
        categoria: "Luxo",
        status: "disponivel",
        imagem: "https://images.unsplash.com/photo-1610768764270-790fbec18178?w=400&h=300&fit=crop",
      },
      {
        id: 8,
        modelo: "Kicks",
        marca: "Nissan",
        ano: 2023,
        precoDiaria: 150,
        categoria: "SUV",
        status: "disponivel",
        imagem: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=300&fit=crop",
      },
      {
        id: 9,
        modelo: "Série 3",
        marca: "BMW",
        ano: 2024,
        precoDiaria: 450,
        categoria: "Luxo",
        status: "disponivel",
        imagem: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop",
      },
      {
        id: 10,
        modelo: "Gol",
        marca: "Volkswagen",
        ano: 2023,
        precoDiaria: 100,
        categoria: "Econômico",
        status: "disponivel",
        imagem: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=300&fit=crop",
      },
    ]
    localStorage.setItem("carros", JSON.stringify(carrosIniciais))
  }

  if (!localStorage.getItem("clientes")) {
    const clientesIniciais = [
      {
        id: 1,
        nome: "Cliente Teste",
        email: "cliente@gmail.com",
        senha: "123456",
        tipo: "cliente",
        limiteCredito: 5000,
        creditoDisponivel: 5000,
        status: "ativo",
        dataCadastro: new Date().toISOString().split("T")[0],
      },
      {
        id: 2,
        nome: "Admin Sistema",
        email: "admin@admin.com",
        senha: "123456",
        tipo: "admin",
        limiteCredito: 0,
        creditoDisponivel: 0,
        status: "ativo",
        dataCadastro: new Date().toISOString().split("T")[0],
      },
      {
        id: 3,
        nome: "Banco Financeiro",
        email: "banco@banco.com",
        senha: "123456",
        tipo: "banco",
        limiteCredito: 0,
        creditoDisponivel: 0,
        status: "ativo",
        dataCadastro: new Date().toISOString().split("T")[0],
      },
    ]
    localStorage.setItem("clientes", JSON.stringify(clientesIniciais))
  }

  if (!localStorage.getItem("reservas")) {
    localStorage.setItem("reservas", JSON.stringify([]))
  }

  if (!localStorage.getItem("pagamentos")) {
    localStorage.setItem("pagamentos", JSON.stringify([]))
  }
}

// Funções auxiliares para manipular dados
function obterCarros() {
  return JSON.parse(localStorage.getItem("carros") || "[]")
}

function salvarCarros(carros) {
  localStorage.setItem("carros", JSON.stringify(carros))
}

function obterClientes() {
  return JSON.parse(localStorage.getItem("clientes") || "[]")
}

function salvarClientes(clientes) {
  localStorage.setItem("clientes", JSON.stringify(clientes))
}

function obterReservas() {
  return JSON.parse(localStorage.getItem("reservas") || "[]")
}

function salvarReservas(reservas) {
  localStorage.setItem("reservas", JSON.stringify(reservas))
}

function obterPagamentos() {
  return JSON.parse(localStorage.getItem("pagamentos") || "[]")
}

function salvarPagamentos(pagamentos) {
  localStorage.setItem("pagamentos", JSON.stringify(pagamentos))
}

function gerarId(array) {
  if (array.length === 0) return 1
  return Math.max(...array.map((item) => item.id)) + 1
}

// Formatar moeda
function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// Formatar data
function formatarData(data) {
  const d = new Date(data + "T00:00:00")
  return d.toLocaleDateString("pt-BR")
}

// Calcular dias entre datas
function calcularDias(dataInicio, dataFim) {
  const inicio = new Date(dataInicio + "T00:00:00")
  const fim = new Date(dataFim + "T00:00:00")
  const diferenca = fim - inicio
  return Math.ceil(diferenca / (1000 * 60 * 60 * 24))
}
