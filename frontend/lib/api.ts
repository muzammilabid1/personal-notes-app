const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {},
) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
  });

  if (response.status !== 401 || endpoint === "/api/auth/refresh") {
    return response;
  }

  const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!refreshResponse.ok) {
    return response;
  }

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
  });
};