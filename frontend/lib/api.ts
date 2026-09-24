const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
  });

  console.log("apiFetch response:", endpoint, response.status);

  if (response.status !== 401) {
    return response;
  }

  console.log("Access token expired. Refreshing...");

  const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  console.log("Refresh response:", refreshResponse.status);

  if (!refreshResponse.ok) {
    return response;
  }

  console.log("Refresh successful. Retrying:", endpoint);

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
  });
};