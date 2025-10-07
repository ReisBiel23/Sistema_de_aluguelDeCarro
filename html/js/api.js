// API Configuration and Helper Functions
const API_BASE = "http://localhost:8080/api"

// Get auth token from localStorage
function getAuthToken() {
  return localStorage.getItem("authToken")
}

// Set auth token in localStorage
function setAuthToken(token) {
  localStorage.setItem("authToken", token)
}

// Remove auth token
function removeAuthToken() {
  localStorage.removeItem("authToken")
}

// Get current user from localStorage
function getCurrentUser() {
  const userStr = localStorage.getItem("currentUser")
  return userStr ? JSON.parse(userStr) : null
}

// Set current user in localStorage
function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user))
}

// Remove current user
function removeCurrentUser() {
  localStorage.removeItem("currentUser")
}

// Generic fetch wrapper with auth
async function apiFetch(endpoint, options = {}) {
  const token = getAuthToken()
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers,
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config)

    // Handle 401 Unauthorized
    if (response.status === 401) {
      removeAuthToken()
      removeCurrentUser()
      window.location.href = "/index.html"
      throw new Error("Unauthorized")
    }

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Request failed")
    }

    return data
  } catch (error) {
    console.error("API Error:", error)
    throw error
  }
}

// Authentication APIs
export async function login(email, password, userType) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password, userType }),
  })

  if (data.token) {
    setAuthToken(data.token)
    setCurrentUser(data.user)
  }

  return data
}

export async function register(userData) {
  return await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  })
}

export async function logout() {
  removeAuthToken()
  removeCurrentUser()
  window.location.href = "/index.html"
}

// Cliente APIs
export async function getClientes() {
  return await apiFetch("/clientes")
}

export async function createCliente(clienteData) {
  return await apiFetch("/clientes", {
    method: "POST",
    body: JSON.stringify(clienteData),
  })
}

// Veículos APIs
export async function getVeiculos() {
  return await apiFetch("/veiculos")
}

export async function getVeiculoById(id) {
  return await apiFetch(`/veiculos/${id}`)
}

// Pedidos APIs
export async function getPedidos() {
  return await apiFetch("/pedidos")
}

export async function createPedido(pedidoData) {
  return await apiFetch("/pedidos", {
    method: "POST",
    body: JSON.stringify(pedidoData),
  })
}

export async function deletePedido(id) {
  return await apiFetch(`/pedidos/${id}`, {
    method: "DELETE",
  })
}

// Contratos APIs
export async function getContratos() {
  return await apiFetch("/contratos")
}

export async function createContrato(contratoData) {
  return await apiFetch("/contratos", {
    method: "POST",
    body: JSON.stringify(contratoData),
  })
}

// Financiamento APIs
export async function calcularFinanciamento(financiamentoData) {
  return await apiFetch("/financiamentos/calcular", {
    method: "POST",
    body: JSON.stringify(financiamentoData),
  })
}

// Usuario APIs
export async function updateUsuario(id, userData) {
  return await apiFetch(`/usuarios/${id}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  })
}

// Check if user is authenticated
export function isAuthenticated() {
  return !!getAuthToken()
}

// Redirect to login if not authenticated
export function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = "/index.html"
  }
}

// Export utility functions
export { getCurrentUser, setCurrentUser }
