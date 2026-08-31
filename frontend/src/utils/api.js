const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Helper untuk mengambil token otentikasi dari localStorage
 */
export function getAuthToken() {
  return localStorage.getItem('token');
}

/**
 * Wrapper dasar buat request fetch ke backend Express - auto JSON parsing,
 * nempelin JWT token kalau ada, dan lempar Error kalau gagal.
 */
export async function apiRequest(path, options = {}) {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const token = getAuthToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const json = await response.json().catch(() => ({
    success: false,
    message: `HTTP error ${response.status}`,
  }));

  if (!response.ok || json.success === false) {
    const errorMsg = json.message || `Request gagal: ${response.status} ${response.statusText}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = json;
    throw err;
  }

  return json;
}

/**
 * GET request helper dengan query params builder
 */
export async function apiGet(path, params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value);
    }
  });

  const queryString = query.toString();
  const url = queryString ? `${path}?${queryString}` : path;

  return apiRequest(url, { method: 'GET' });
}

/**
 * POST request helper
 */
export async function apiPost(path, body = {}) {
  return apiRequest(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * PUT request helper
 */
export async function apiPut(path, body = {}) {
  return apiRequest(path, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

/**
 * PATCH request helper
 */
export async function apiPatch(path, body = {}) {
  return apiRequest(path, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

/**
 * DELETE request helper
 */
export async function apiDelete(path) {
  return apiRequest(path, { method: 'DELETE' });
}

export default {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  patch: apiPatch,
  delete: apiDelete,
  getToken: getAuthToken,
};
