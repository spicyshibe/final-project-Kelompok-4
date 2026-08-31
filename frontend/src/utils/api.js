const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Wrapper buat API fetch ke backend Express
 */
export async function apiRequest(path, options = {}) {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
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
 * DELETE request helper
 */
export async function apiDelete(path) {
  return apiRequest(path, {
    method: 'DELETE',
  });
}
