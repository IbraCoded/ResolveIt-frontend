import { authService } from "./auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

class UserService {
  async updateProfile(userData, photoFile) {
    try {
      const formData = new FormData()

      // Add all user data to form
      Object.keys(userData).forEach((key) => {
        formData.append(key, userData[key])
      })

      // Add photo if provided
      if (photoFile) {
        formData.append("photo", photoFile)
      }

      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: "PUT",
        headers: {
          ...authService.getAuthHeaders(),
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to update profile")
      }

      return await response.json()
    } catch (error) {
      throw error
    }
  }

  async changePassword(currentPassword, newPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authService.getAuthHeaders(),
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to change password")
      }

      return await response.json()
    } catch (error) {
      throw error
    }
  }

  async getUserProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authService.getAuthHeaders(),
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to fetch profile")
      }

      return await response.json()
    } catch (error) {
      throw error
    }
  }

  async deleteAccount() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/account`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...authService.getAuthHeaders(),
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to delete account")
      }

      return await response.json()
    } catch (error) {
      throw error
    }
  }
}

export const userService = new UserService()
