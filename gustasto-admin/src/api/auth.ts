const API_URL = 'http://localhost:3000';

export async function loginApi(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'E-poçt ünvanı və ya şifrə yanlışdır');
  }
  return res.json();
}

export async function sendCodeApi(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/send-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Kod göndərilmədi');
  }
  return res.json();
}

export async function verifyCodeApi(sessionId: string, code: string) {
  const res = await fetch(`${API_URL}/api/auth/verify-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, code }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Kod yanlışdır');
  }
  return res.json();
}

export async function getProfile(token: string) {
  const res = await fetch(`${API_URL}/api/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error('Giriş səlahiyyəti yoxdur');
  }
  return res.json();
}
