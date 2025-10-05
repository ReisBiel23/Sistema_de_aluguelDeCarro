// Verificar se usuário está logado
function verificarAutenticacao() {
  const sessao = JSON.parse(localStorage.getItem("sessaoAtual"))
  if (!sessao) {
    window.location.href = "index.html"
    return null
  }
  return sessao
}

// Verificar tipo de usuário
function verificarTipoUsuario(tipoEsperado) {
  const sessao = verificarAutenticacao()
  if (sessao && sessao.tipo !== tipoEsperado) {
    alert("Acesso negado! Você não tem permissão para acessar esta página.")
    fazerLogout()
    return false
  }
  return true
}

// Fazer login
function fazerLogin(email, senha) {
  const clientes = obterClientes()

  console.log("[v0] Tentando login com email:", email)
  console.log("[v0] Total de clientes no sistema:", clientes.length)
  console.log(
    "[v0] Clientes disponíveis:",
    clientes.map((c) => ({ email: c.email, tipo: c.tipo })),
  )

  const usuario = clientes.find((c) => c.email === email && c.senha === senha)

  if (!usuario) {
    console.log("[v0] Usuário não encontrado ou senha incorreta")
    return {
      sucesso: false,
      mensagem: "Email ou senha incorretos!",
    }
  }

  if (usuario.status === "bloqueado") {
    return {
      sucesso: false,
      mensagem: "Sua conta está bloqueada. Entre em contato com o banco.",
    }
  }

  // Criar sessão
  const sessao = {
    usuarioId: usuario.id,
    tipo: usuario.tipo,
    nome: usuario.nome,
  }

  localStorage.setItem("sessaoAtual", JSON.stringify(sessao))

  console.log("[v0] Login realizado com sucesso para:", usuario.nome)

  return {
    sucesso: true,
    usuario: usuario,
  }
}

// Cadastrar novo usuário
function cadastrarUsuario(nome, email, senha) {
  const clientes = obterClientes()

  console.log("[v0] Tentando cadastrar novo usuário:", email)
  console.log("[v0] Clientes existentes:", clientes.length)

  // Verificar se email já existe
  if (clientes.find((c) => c.email === email)) {
    console.log("[v0] Email já cadastrado:", email)
    return {
      sucesso: false,
      mensagem: "Este email já está cadastrado!",
    }
  }

  const novoCliente = {
    id: gerarId(clientes),
    nome: nome,
    email: email,
    senha: senha,
    tipo: "cliente",
    limiteCredito: 5000,
    creditoDisponivel: 5000,
    status: "ativo",
    dataCadastro: new Date().toISOString().split("T")[0],
  }

  clientes.push(novoCliente)
  salvarClientes(clientes)

  console.log("Novo cliente cadastrado com sucesso:", novoCliente)
  console.log("Total de clientes após cadastro:", clientes.length)

  return {
    sucesso: true,
    mensagem: "Cadastro realizado com sucesso!",
  }
}

// Fazer logout
function fazerLogout() {
  localStorage.removeItem("sessaoAtual")
  window.location.href = "index.html"
}

// Obter usuário atual
function obterUsuarioAtual() {
  const sessao = JSON.parse(localStorage.getItem("sessaoAtual"))
  if (!sessao) return null

  const clientes = obterClientes()
  return clientes.find((c) => c.id === sessao.usuarioId)
}

// Importar funções necessárias
function obterClientes() {
  // Implementação da função obterClientes
}

function gerarId(clientes) {
  // Implementação da função gerarId
}

function salvarClientes(clientes) {
  // Implementação da função salvarClientes
}
