// Login Page Logic
import Auth from './auth.js'

// Elements
const googleLoginBtn = document.getElementById('googleLogin')
const loginForm = document.getElementById('loginForm')
const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')
const errorDiv = document.getElementById('authError')

// Show error
function showError(message) {
    errorDiv.textContent = message
    errorDiv.classList.add('show')

    setTimeout(() => {
        errorDiv.classList.remove('show')
    }, 5000)
}

// Show loading state
function setLoading(isLoading) {
    if (isLoading) {
        document.body.classList.add('loading')
    } else {
        document.body.classList.remove('loading')
    }
}

// Google Sign In
googleLoginBtn.addEventListener('click', async () => {
    setLoading(true)

    const result = await Auth.signInWithGoogle()

    if (!result.success) {
        setLoading(false)
        showError(result.error || 'Erro ao fazer login com Google')
    }

    // Redirect automático feito pelo Supabase
})

// Email/Password Sign In
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const email = emailInput.value.trim()
    const password = passwordInput.value

    if (!email || !password) {
        showError('Por favor, preencha todos os campos')
        return
    }

    setLoading(true)

    const result = await Auth.signIn(email, password)

    if (result.success) {
        // Redirect to app
        window.location.href = '/app.html'
    } else {
        setLoading(false)
        showError(result.error || 'Email ou senha incorretos')
    }
})

    // Check if already logged in
    ; (async () => {
        const user = await Auth.getUser()

        if (user) {
            // Already logged in, redirect to app
            window.location.href = '/app.html'
        }
    })()
