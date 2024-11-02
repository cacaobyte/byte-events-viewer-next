import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import CryptoJS from 'crypto-js';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Función para almacenar el token encriptado
export const storeEncryptedToken = (token: string) => {
  // Encripta el token usando AES
  if (!process.env.NEXT_PUBLIC_KEY) {
    throw new Error("Encryption key is not defined");
  }
  const encryptedToken = CryptoJS.AES.encrypt(token, process.env.NEXT_PUBLIC_KEY).toString();

  // Almacena el token encriptado en localStorage
  localStorage.setItem('token', encryptedToken);
}

// Función para obtener y desencriptar el token
export const getDecryptedToken = (): string | null => {
  // Verifica si la clave de encriptación está definida
  if (!process.env.NEXT_PUBLIC_KEY) {
    throw new Error("Encryption key is not defined");
  }

  // Obtiene el token encriptado desde localStorage
  const encryptedToken = localStorage.getItem('token');

  // Si no hay un token encriptado, retorna null
  if (!encryptedToken) return null;

  // Desencripta el token usando AES
  const bytes = CryptoJS.AES.decrypt(encryptedToken, process.env.NEXT_PUBLIC_KEY);
  const token = bytes.toString(CryptoJS.enc.Utf8);

  // Retorna el token desencriptado o null si está vacío
  return token || null;
};
