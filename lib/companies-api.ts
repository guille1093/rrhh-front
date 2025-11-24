import type {
  CompanyCreateRequest,
  CompanyUpdateRequest,
  CompaniesResponse,
  CompanyResponse,
} from "@/types/organizational-structure"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export class CompaniesAPI {
  private static getAuthHeaders() {
    const token = localStorage.getItem("access_token")
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  }

  static async getCompanies(
    params: {
      orderBy?: string
      orderType?: "ASC" | "DESC"
      offset?: number
      pageSize?: number
      name?: string
    } = {},
  ): Promise<CompaniesResponse> {
    const { orderBy = "id", orderType = "DESC", offset = 0, pageSize = 10, name } = params
    const queryParams = new URLSearchParams({
      orderBy,
      orderType,
      offset: offset.toString(),
      pageSize: pageSize.toString(),
    })

    if (name) {
      queryParams.append("name", name)
    }

    const response = await fetch(`${API_BASE_URL}/api/companies?${queryParams}`, {
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error("Failed to fetch companies")
    }

    return response.json()
  }

  static async getCompanyById(id: number): Promise<CompanyResponse> {
    const response = await fetch(`${API_BASE_URL}/api/companies/${id}`, {
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error("Failed to fetch company")
    }

    return response.json()
  }

  static async createCompany(companyData: CompanyCreateRequest): Promise<CompanyResponse> {
    const response = await fetch(`${API_BASE_URL}/api/companies`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(companyData),
    })

    if (!response.ok) {
      throw new Error("Failed to create company")
    }

    return response.json()
  }

  static async updateCompany(id: number, companyData: CompanyUpdateRequest): Promise<CompanyResponse> {
    const response = await fetch(`${API_BASE_URL}/api/companies/${id}`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(companyData),
    })

    if (!response.ok) {
      throw new Error("Failed to update company")
    }

    return response.json()
  }

  static async deleteCompany(id: number): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/companies/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error("Failed to delete company")
    }

    return response.json()
  }
}

export const getCompanies = CompaniesAPI.getCompanies.bind(CompaniesAPI)
export const getCompanyById = CompaniesAPI.getCompanyById.bind(CompaniesAPI)
export const createCompany = CompaniesAPI.createCompany.bind(CompaniesAPI)
export const updateCompany = CompaniesAPI.updateCompany.bind(CompaniesAPI)
export const deleteCompany = CompaniesAPI.deleteCompany.bind(CompaniesAPI)
