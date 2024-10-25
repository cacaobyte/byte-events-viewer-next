import apiClient from "@/api/api-client"

export interface LoginCredentials {
  identifier: string
  password: string
}

export interface User {
  name: string
  email: string
}

interface LoginResponse {
  token: string
}

interface RegisterUser {
  username: string
  email: string
  password: string
  status: string
  phone_number: string
  profile_picture: string
  address: string
  is_host: boolean
  is_validator: boolean
  is_admin: boolean
}

interface RegisterResponse {
  message: string
  id: string
}

interface UserInfo {
  id: string
  username: string
  email: string
  status: string
  phone_number: string
  profile_picture: string
  address: string
  is_host: boolean
  is_validator: boolean
  is_admin: boolean
}

/**
 * Logs in a user with the provided credentials.
 *
 * @param credentials - The login credentials of the user.
 * @returns A promise that resolves to the login response.
 */
export const login = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>(
    "/users/login",
    credentials
  )
  return response.data
}

export const register = async (
  RegisterUser: RegisterUser
): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>(
    "/users/register",
    RegisterUser
  )
  return response.data
}

export const getCurrentUser = async (): Promise<User | null> => {
  const response = await apiClient.get<User>("/users/info")
  return response.data || null
}

export const getUserInfo = async (token: string): Promise<UserInfo | null> => {
  const response = await apiClient.get<UserInfo>("/users/info", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data || null
}
