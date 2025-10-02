// Dados dos carros (simulação de banco de dados)
const carros = [
  {
    id: 1,
    modelo: "Fiat Mobi",
    categoria: "Econômico",
    ano: 2024,
    preco: 120,
    imagem: "../public/fiat-mobi-red.jpg",
    descricao: "Carro econômico perfeito para o dia a dia na cidade.",
    disponivel: true,
  },
  {
    id: 2,
    modelo: "Chevrolet Onix",
    categoria: "Econômico",
    ano: 2024,
    preco: 150,
    imagem: "public/chevrolet-onix-silver.jpg",
    descricao: "Conforto e economia em um só veículo.",
    disponivel: true,
  },
  {
    id: 3,
    modelo: "Jeep Compass",
    categoria: "SUV",
    ano: 2024,
    preco: 280,
    imagem: "public/jeep-compass-black.jpg",
    descricao: "SUV robusto com muito espaço e conforto.",
    disponivel: true,
  },
  {
    id: 4,
    modelo: "Toyota Corolla Cross",
    categoria: "SUV",
    ano: 2024,
    preco: 320,
    imagem: "public/toyota-corolla-cross.jpg",
    descricao: "SUV moderno com tecnologia de ponta.",
    disponivel: true,
  },
  {
    id: 5,
    modelo: "BMW 320i",
    categoria: "Luxo",
    ano: 2024,
    preco: 450,
    imagem: "public/bmw-320i-blue.jpg",
    descricao: "Luxo e performance em um sedan premium.",
    disponivel: true,
  },
  {
    id: 6,
    modelo: "Mercedes-Benz C180",
    categoria: "Luxo",
    ano: 2024,
    preco: 480,
    imagem: "public/mercedes-c180-white.jpg",
    descricao: "Elegância e sofisticação alemã.",
    disponivel: true,
  },
  {
    id: 7,
    modelo: "Porsche 911",
    categoria: "Esportivo",
    ano: 2024,
    preco: 850,
    imagem: "public/red-porsche-911.png",
    descricao: "Esportivo icônico com performance excepcional.",
    disponivel: true,
  },
  {
    id: 8,
    modelo: "Ford Mustang",
    categoria: "Esportivo",
    ano: 2024,
    preco: 720,
    imagem: "public/ford-mustang-yellow.jpg",
    descricao: "Muscle car americano com design agressivo.",
    disponivel: true,
  },
]

// Salvar carros no localStorage se não existirem
if (!localStorage.getItem("carros")) {
  localStorage.setItem("carros", JSON.stringify(carros))
}

const carrosGrid = document.getElementById("carrosGrid")
const searchInput = document.getElementById("searchInput")
const categoriaFiltro = document.getElementById("categoriaFiltro")
const precoFiltro = document.getElementById("precoFiltro")

function renderizarCarros(carrosFiltrados) {
  carrosGrid.innerHTML = ""

  if (carrosFiltrados.length === 0) {
    carrosGrid.innerHTML =
      '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">Nenhum carro encontrado.</p>'
    return
  }

  carrosFiltrados.forEach((carro) => {
    const carroCard = document.createElement("div")
    carroCard.className = "carro-card"
    carroCard.innerHTML = `
            <img src="${carro.imagem}" alt="${carro.modelo}">
            <div class="carro-info">
                <h3>${carro.modelo}</h3>
                <span class="carro-categoria">${carro.categoria}</span>
                <p class="carro-preco">R$ ${carro.preco}<span>/dia</span></p>
                <a href="detalhes.html?id=${carro.id}" class="btn-primary">Ver Detalhes</a>
            </div>
        `
    carrosGrid.appendChild(carroCard)
  })
}

function filtrarCarros() {
  const carrosData = JSON.parse(localStorage.getItem("carros") || "[]")
  const searchTerm = searchInput.value.toLowerCase()
  const categoria = categoriaFiltro.value
  const precoRange = precoFiltro.value

  const carrosFiltrados = carrosData.filter((carro) => {
    const matchSearch = carro.modelo.toLowerCase().includes(searchTerm)
    const matchCategoria = !categoria || carro.categoria === categoria

    let matchPreco = true
    if (precoRange) {
      const [min, max] = precoRange.split("-").map(Number)
      matchPreco = carro.preco >= min && carro.preco <= max
    }

    return matchSearch && matchCategoria && matchPreco
  })

  renderizarCarros(carrosFiltrados)
}

// Event listeners
searchInput.addEventListener("input", filtrarCarros)
categoriaFiltro.addEventListener("change", filtrarCarros)
precoFiltro.addEventListener("change", filtrarCarros)

// Renderizar todos os carros ao carregar
renderizarCarros(JSON.parse(localStorage.getItem("carros") || "[]"))
