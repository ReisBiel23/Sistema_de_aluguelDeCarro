const detalhesContent = document.getElementById("detalhesContent")
const carrosSimilares = document.getElementById("carrosSimilares")

// Obter ID do carro da URL
const urlParams = new URLSearchParams(window.location.search)
const carroId = Number.parseInt(urlParams.get("id"))

function renderizarDetalhes() {
  const carros = JSON.parse(localStorage.getItem("carros") || "[]")
  const carro = carros.find((c) => c.id === carroId)

  if (!carro) {
    detalhesContent.innerHTML = "<p>Carro não encontrado.</p>"
    return
  }

  const descontoSemanal = Math.round(carro.preco * 7 * 0.9)
  const descontoMensal = Math.round(carro.preco * 30 * 0.8)

  detalhesContent.innerHTML = `
        <div class="detalhes-grid">
            <div class="detalhes-imagem">
                <img src="${carro.imagem}" alt="${carro.modelo}">
            </div>
            <div class="detalhes-info">
                <h1>${carro.modelo}</h1>
                <div class="detalhes-meta">
                    <span class="meta-item">Ano: ${carro.ano}</span>
                    <span class="meta-item">${carro.categoria}</span>
                </div>
                <p class="detalhes-preco">R$ ${carro.preco}<span>/dia</span></p>
                <div class="desconto-info">
                    <strong>Descontos especiais:</strong><br>
                    Semanal: R$ ${descontoSemanal} (10% off)<br>
                    Mensal: R$ ${descontoMensal} (20% off)
                </div>
                <div class="detalhes-descricao">
                    <h3>Descrição</h3>
                    <p>${carro.descricao}</p>
                </div>
                <a href="reserva.html?id=${carro.id}" class="btn-primary">Fazer Reserva</a>
            </div>
        </div>
    `

  // Renderizar carros similares
  const similares = carros.filter((c) => c.categoria === carro.categoria && c.id !== carro.id).slice(0, 3)

  if (similares.length > 0) {
    similares.forEach((similar) => {
      const carroCard = document.createElement("div")
      carroCard.className = "carro-card"
      carroCard.innerHTML = `
                <img src="${similar.imagem}" alt="${similar.modelo}">
                <div class="carro-info">
                    <h3>${similar.modelo}</h3>
                    <span class="carro-categoria">${similar.categoria}</span>
                    <p class="carro-preco">R$ ${similar.preco}<span>/dia</span></p>
                    <a href="detalhes.html?id=${similar.id}" class="btn-primary">Ver Detalhes</a>
                </div>
            `
      carrosSimilares.appendChild(carroCard)
    })
  } else {
    carrosSimilares.innerHTML = "<p>Nenhum carro similar encontrado.</p>"
  }
}

renderizarDetalhes()
