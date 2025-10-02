

function login(email, senha) {
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]")
  const usuario = usuarios.find((u) => u.email === email && u.senha === senha)

  if (usuario) {
    const usuarioLogado = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      tipo: usuario.tipo || "cliente",
    }
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado))
    return { sucesso: true, usuario: usuarioLogado }
  }

  return { sucesso: false, mensagem: "E-mail ou senha incorretos" }
}

function cadastrar(dados) {
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]")

  
  if (usuarios.find((u) => u.email === dados.email)) {
    return { sucesso: false, mensagem: "E-mail já cadastrado" }
  }

  const novoUsuario = {
    id: Date.now(),
    nome: dados.nome,
    email: dados.email,
    telefone: dados.telefone,
    senha: dados.senha,
    tipo: "cliente",
    dataCadastro: new Date().toISOString(),
  }

  usuarios.push(novoUsuario)
  localStorage.setItem("usuarios", JSON.stringify(usuarios))

  return { sucesso: true, mensagem: "Cadastro realizado com sucesso!" }
}

function logout() {
  localStorage.removeItem("usuarioLogado")
  window.location.href = "index.html"
}

function getUsuarioLogado() {
  const usuario = localStorage.getItem("usuarioLogado")
  return usuario ? JSON.parse(usuario) : null
}

function verificarAutenticacao() {
  const usuario = getUsuarioLogado()
  if (!usuario) {
    window.location.href = "login.html"
    return false
  }
  return true
}

function verificarAdmin() {
  const usuario = getUsuarioLogado()
  if (!usuario || usuario.tipo !== "admin") {
    window.location.href = "index.html"
    return false
  }
  return true
}


function atualizarNavegacao() {
  const usuario = getUsuarioLogado()
  const loginLink = document.getElementById("loginLink")
  const logoutLink = document.getElementById("logoutLink")
  const dashboardLink = document.getElementById("dashboardLink")

  if (usuario) {
    if (loginLink) loginLink.style.display = "none"
    if (logoutLink) {
      logoutLink.style.display = "block"
      logoutLink.addEventListener("click", (e) => {
        e.preventDefault()
        logout()
      })
    }
    if (dashboardLink) dashboardLink.style.display = "block"
  } else {
    if (loginLink) loginLink.style.display = "block"
    if (logoutLink) logoutLink.style.display = "none"
    if (dashboardLink) dashboardLink.style.display = "none"
  }
}


function inicializarDados() {
  if (!localStorage.getItem("dadosInicializados")) {
    
    const usuarios = [
      {
        id: 1,
        nome: "Administrador",
        email: "admin@rentcar.com",
        telefone: "(11) 99999-9999",
        senha: "admin123",
        tipo: "admin",
        dataCadastro: new Date().toISOString(),
      },
    ]
    localStorage.setItem("usuarios", JSON.stringify(usuarios))
    localStorage.setItem("dadosInicializados", "true")
  }
}


if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    inicializarDados()
    atualizarNavegacao()
  })
} else {
  inicializarDados()
  atualizarNavegacao()
}
