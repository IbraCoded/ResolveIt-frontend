const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

class AuthService {
  constructor() {
    this.tokenKey = "resolveit_token"
    this.userKey = "resolveit_user"
  }

  async login(email, password) {
    try {
      const formData = new FormData()
      formData.append("username", email)
      formData.append("password", password)

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Login failed")
      }

      const data = await response.json()

      // Store token and user data
      localStorage.setItem(this.tokenKey, data.access_token)
      localStorage.setItem(this.userKey, JSON.stringify(data.user))

      return data
    } catch (error) {
      throw error
    }
  }

  async register(userData, photoFile) {
    try {
      const formData = new FormData()

      // Add all user data to form
      Object.keys(userData).forEach((key) => {
        if (key !== "confirmPassword") {
          formData.append(key, userData[key])
        }
      })

      // Add photo if provided
      if (photoFile) {
        formData.append("file", photoFile)
      }

      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Registration failed")
      }

      return await response.json()
    } catch (error) {
      throw error
    }
  }

  logout() {
    localStorage.removeItem(this.tokenKey)
    localStorage.removeItem(this.userKey)
  }

  getToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.tokenKey)
    }
    return null
  }

  getCurrentUser() {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem(this.userKey)
      return userStr ? JSON.parse(userStr) : null
    }
    return null
  }

  isAuthenticated() {
    return !!this.getToken()
  }

  getAuthHeaders() {
    const token = this.getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }
}

export const authService = new AuthService()
