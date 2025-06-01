import { auth } from "@clerk/nextjs/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fonction utilitaire pour les requêtes authentifiées
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
  isServerComponent: boolean = true
): Promise<Response> {
  let token: string | null = null;

  if (isServerComponent) {
    // Pour les Server Components
    const authResult = await auth();
    token = await authResult.getToken({ template: "default" });
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, { ...options, headers });
}

// Fonctions pour les composants client
export async function fetchWithClientAuth(
  url: string,
  token: string | null,
  options: RequestInit = {}
): Promise<Response> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, { ...options, headers });
} 