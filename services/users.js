import { authService } from "./auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

class UsersService {
  async searchUsers(query) {
    try {
      if (!query || query.trim().length < 2) {
        return []
      }

      const response = await fetch(`${API_BASE_URL}/users/search?name=${encodeURIComponent(query.trim())}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authService.getAuthHeaders(),
        },
      })

      if (!response.ok) {
        // Don't throw error for search failures, just return empty array
        console.warn("User search failed:", response.status)
        return []
      }

      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.warn("User search error:", error)
      return []
    }
  }
}

export const usersService = new UsersService()
