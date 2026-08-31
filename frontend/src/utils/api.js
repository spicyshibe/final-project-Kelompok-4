const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Wrapper kecil buat GET request ke backend, biar gak nulis ulang
 * fetch() + error handling di tiap komponen/hook yang butuh data.
 */
export async function apiGet(path) {
  const res = await fetch(`${BASE_URL}${path}`);

  if (!res.ok) {
    throw new Error(`Request gagal: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

async function sendJson(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || `Request gagal: ${res.status} ${res.statusText}`);
  }

  return json;
}

export const apiPost = (path, body) => sendJson('POST', path, body);
export const apiPatch = (path, body) => sendJson('PATCH', path, body);
