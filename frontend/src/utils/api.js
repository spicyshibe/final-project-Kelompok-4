const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Helper untuk mengambil token otentikasi dari localStorage
 */
export function getAuthToken() {
  return localStorage.getItem('token');
}

/**
 * Helper dasar untuk request fetch dengan auto JSON parsing dan JWT token
 */
async function request(path, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  if (!response.ok) {
    const errorMessage = data?.message || `Request gagal (${response.status}: ${response.statusText})`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * GET request
 */
export async function apiGet(path) {
  return request(path, { method: 'GET' });
}

/**
 * POST request
 */
export async function apiPost(path, body) {
  return request(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * PUT request
 */
export async function apiPut(path, body) {
  return request(path, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

/**
 * DELETE request
 */
export async function apiDelete(path) {
  return request(path, { method: 'DELETE' });
}

export default {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
  getToken: getAuthToken,
};
