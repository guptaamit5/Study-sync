const API_URL = "https://study-sync-2hsw.onrender.com/api";

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};
