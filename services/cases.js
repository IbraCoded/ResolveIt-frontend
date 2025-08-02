import { authService } from "./auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

class CaseService {
  async createCase(caseData, proofFile) {
    try {
      const formData = new FormData()

      // Add all case data to form
      Object.keys(caseData).forEach((key) => {
        formData.append(key, caseData[key])
      })

      // Add proof file if provided
      if (proofFile) {
        formData.append("proof", proofFile)
      }

      const response = await fetch(`${API_BASE_URL}/cases/`, {
        method: "POST",
        headers: {
          ...authService.getAuthHeaders(),
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to create case")
      }

      return await response.json()
    } catch (error) {
      throw error
    }
  }

  async getUserCases() {
    try {
      const response = await fetch(`${API_BASE_URL}/cases/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authService.getAuthHeaders(),
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to fetch cases")
      }

      return await response.json()
    } catch (error) {
      throw error
    }
  }

  async getAllCases() {
    try {
      const response = await fetch(`${API_BASE_URL}/cases/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authService.getAuthHeaders(),
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to fetch all cases")
      }

      return await response.json()
    } catch (error) {
      throw error
    }
  }

  async getCaseById(caseId) {
    try {
      const response = await fetch(`${API_BASE_URL}/cases/${caseId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...authService.getAuthHeaders(),
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to fetch case details")
      }

      return await response.json()
    } catch (error) {
      throw error
    }
  }

  async updateCaseStatus(caseId, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/cases/${caseId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authService.getAuthHeaders(),
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to update case status")
      }

      return await response.json()
    } catch (error) {
      throw error
    }
  }
}

export const caseService = new CaseService()
