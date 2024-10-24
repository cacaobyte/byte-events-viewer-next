import apiClient from "@/api/api-client"

export interface LoginCredentials {
  username: string
  password: string
}

export interface User {
  name: string
  email: string
}

export const login = async (credentials: LoginCredentials): Promise<User> => {
  const response = await apiClient.post<User>("/users/login", credentials)
  return response.data
}

export const logout = async (): Promise<void> => {
  await apiClient.post("/users/logout")
}

export const getCurrentUser = async (): Promise<User | null> => {
  const response = await apiClient.get<User>("/users/info")
  return response.data || null
}
