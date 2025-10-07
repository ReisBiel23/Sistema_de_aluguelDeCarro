// Simple client-side auth for development/testing only.
// Dev users + login, storage, role helpers, UI visibility, and route protection.
// WARNING: do NOT use this approach in production.

(function (global) {
  const STORAGE_KEY = 'currentUser_dev'; // dev-only

  // Dev users (DO NOT use in production)
  const DEV_USERS = [
    { email: 'cliente@cliente.com', password: '123456', role: 'client', name: 'Cliente' },
    { email: 'administrador@administrador.com', password: '123456', role: 'admin', name: 'Administrador' }
  ];

  // Utility to navigate safely using relative paths when loaded via file://
  function navigateTo(target) {
    if (!target) return;
    let url = String(target);

    // If running from file:// and target starts with '/', strip leading slashes to keep it relative
    if (location.protocol === 'file:') {
      url = url.replace(/^\/+/, '');
    }

    // If absolute URL with protocol, use it directly
    if (/^[a-z0-9]+:/i.test(url)) {
      window.location.href = url;
      return;
    }

    // If starts with "/" treat as root-relative (useful when served by a webserver)
    if (url.startsWith('/')) {
      window.location.href = url;
      return;
    }

    // Otherwise construct a path relative to current document folder
    const basePath = window.location.pathname.replace(/\/[^\/]*$/, '/');
    window.location.href = basePath + url;
  }

  // find user in dev list (simulates authentication)
  function authenticate(email, password) {
    if (!email || !password) return null;
    const u = DEV_USERS.find(user => user.email.toLowerCase() === email.toLowerCase() && user.password === password);
    if (!u) return null;
    return { email: u.email, role: u.role, name: u.name };
  }

  // Login helper: returns user or null. Saves to localStorage
  // default redirect is relative (dashboard.html)
  function loginWithCredentials(email, password, { redirect = 'dashboard.html' } = {}) {
    const user = authenticate(email, password);
    if (!user) return null;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    if (redirect) {
      // small timeout so caller can observe success if needed
      setTimeout(() => { navigateTo(redirect); }, 150);
    }
    return user;
  }

  function getCurrentUser() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function isAdmin() {
    const u = getCurrentUser();
    return !!(u && u.role === 'admin');
  }

  function isClient() {
    const u = getCurrentUser();
    return !!(u && u.role === 'client');
  }

  // logout and navigate to login page (default relative)
  function logout({ redirect = 'index.html' } = {}) {
    localStorage.removeItem(STORAGE_KEY);
    if (redirect) navigateTo(redirect);
  }

  // Show/hide UI elements based on role.
  // Supports:
  // - data-role="admin" or data-role="client" or data-role="admin,client"
  // - elements with classes .role-admin and/or .role-client
  function applyRoleVisibility() {
    const user = getCurrentUser();
    const role = user ? user.role : null;

    // data-role attribute handling
    document.querySelectorAll('[data-role]').forEach(el => {
      const allowed = (el.dataset.role || '').split(',').map(s => s.trim()).filter(Boolean);
      if (!role) {
        el.style.display = 'none';
        return;
      }
      el.style.display = allowed.length === 0 ? '' : (allowed.includes(role) ? '' : 'none');
    });

    // class based handling
    document.querySelectorAll('.role-admin').forEach(el => {
      el.style.display = role === 'admin' ? '' : 'none';
    });
    document.querySelectorAll('.role-client').forEach(el => {
      el.style.display = role === 'client' ? '' : 'none';
    });

    // optional: change UI flag (e.g., add class on body)
    document.body.classList.toggle('role-admin', role === 'admin');
    document.body.classList.toggle('role-client', role === 'client');
  }

  // Protect route: ensure user is logged in. If allowedRoles provided, ensure user has one of them.
  // Usage examples:
  // protectRoute(); // requires authenticated user, else redirects to login.html
  // protectRoute(['admin']); // only admin allowed
  function protectRoute(allowedRoles = null, { loginPage = 'index.html', noPermissionPage = 'no-permission.html' } = {}) {
    const user = getCurrentUser();
    if (!user) {
      navigateTo(loginPage);
      return false;
    }
    if (allowedRoles && Array.isArray(allowedRoles) && allowedRoles.length) {
      if (!allowedRoles.includes(user.role)) {
        navigateTo(noPermissionPage);
        return false;
      }
    }
    return true;
  }

  // Auto-hook: if there's a login form with id "loginForm", attach a handler.
  // form should have inputs [name="email"] and [name="password"].
  // default redirect is relative 'dashboard.html'
  function autoAttachLoginForm({ redirect = 'dashboard.html' } = {}) {
    const form = document.getElementById('loginForm');
    if (!form) return;
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const emailInput = form.querySelector('[name="email"]');
      const passInput = form.querySelector('[name="password"]');
      const email = emailInput ? emailInput.value.trim() : '';
      const password = passInput ? passInput.value : '';

      const user = loginWithCredentials(email, password, { redirect: null }); // we'll navigate manually
      if (!user) {
        // simple error handling - adapt to your UI
        const errEl = form.querySelector('.login-error');
        if (errEl) {
          errEl.textContent = 'Usuário ou senha inválidos';
          errEl.style.display = '';
        } else {
          alert('Usuário ou senha inválidos');
        }
        return;
      }
      // success: navigate using navigateTo to keep it relative
      navigateTo(redirect);
    });
  }

  // Auto-hook logout button with id "logoutBtn"
  function autoAttachLogout({ redirect = 'index.html' } = {}) {
    const btn = document.getElementById('logoutBtn');
    if (!btn) return;
    btn.addEventListener('click', (ev) => {
      ev.preventDefault();
      logout({ redirect });
    });
  }

  // Initialize: apply visibility on DOM ready and attach optional auto handlers.
  // defaults use relative paths
  function initAuth({ autoAttach = true, loginRedirect = 'dashboard.html', logoutRedirect = 'index.html' } = {}) {
    document.addEventListener('DOMContentLoaded', () => {
      applyRoleVisibility();
      if (autoAttach) {
        autoAttachLoginForm({ redirect: loginRedirect });
        autoAttachLogout({ redirect: logoutRedirect });
      }
    });
  }

  // Expose API
  const Api = {
    DEV_USERS,
    authenticate,
    loginWithCredentials,
    getCurrentUser,
    isAdmin,
    isClient,
    logout,
    applyRoleVisibility,
    protectRoute,
    autoAttachLoginForm,
    autoAttachLogout,
    initAuth
  };

  // Export for CommonJS if available (optional)
  try {
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
      module.exports = Api;
    }
  } catch (e) { /* ignore */ }

  // Attach to window for simple usage
  global.Auth = Api;

})(window);