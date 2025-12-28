// Signup Page Logic
import Auth from './auth.js'

// Elements
const googleSignupBtn = document.getElementById('googleSignup')
const signupForm = document.getElementById('signupForm')
const fullNameInput = document.getElementById('fullName')
const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')
const errorDiv = document.getElementById('authError')
const successDiv = document.getElementById('authSuccess')

// Show error
function showError(message) {
    errorDiv.textContent = message
    errorDiv.classList.add('show')
    successDiv.classList.remove('show')

    setTimeout(() => {
        errorDiv.classList.remove('show')
    }, 5000)
}

// Show success
function showSuccess(message) {
    successDiv.textContent = message
    successDiv.classList.add('show')
    errorDiv.classList.remove('show')
}

// Show loading state
function setLoading(isLoading) {
    if (isLoading) {
        document.body.classList.add('loading')
    } else {
        document.body.classList.remove('loading')
    }
}

// Google Sign Up
googleSignupBtn.addEventListener('click', async () => {
    setLoading(true)

    const result = await Auth.signInWithGoogle()

    if (!result.success) {
        setLoading(false)
        showError(result.error || 'Erro ao cadastrar com Google')
    }

    // Redirect automático feito pelo Supabase
})

// Email/Password Sign Up
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const fullName = fullNameInput.value.trim()
    const email = emailInput.value.trim()
    const password = passwordInput.value

    if (!fullName || !email || !password) {
        showError('Por favor, preencha todos os campos')
        return
    }

    if (password.length < 6) {
        showError('A senha deve ter pelo menos 6 caracteres')
        return
    }

    setLoading(true)

    const result = await Auth.signUp(email, password, fullName)

    setLoading(false)

    if (result.success) {
        showSuccess('✅ Conta criada! Verifique seu email para confirmar.')

        // Clear form
        signupForm.reset()

        // Redirect after 3 seconds
        setTimeout(() => {
            window.location.href = '/login.html'
        }, 3000)
    } else {
        showError(result.error || 'Erro ao criar conta')
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
