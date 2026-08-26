// All backend calls live here so screens never call fetch() directly.
// Change API_BASE_URL to your deployed backend URL when you go live —
// right now it's set for local testing on your machine.

import { API_BASE_URL } from '@env';

const BASE = API_BASE_URL || 'http://localhost:5000';

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
}

export async function getUsers() {
  const res = await fetch(`${BASE}/api/users`);
  return handleResponse(res);
}

export async function getAllPreferences(date) {
  const res = await fetch(`${BASE}/api/all-preferences?date=${date}`);
  return handleResponse(res);
}

export async function getMealStatus(mealType, date) {
  const res = await fetch(`${BASE}/api/status/${mealType}?date=${date}`);
  return handleResponse(res);
}

export async function savePreference({ user_id, date, meal_type, quantity }) {
  const res = await fetch(`${BASE}/api/preferences`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, date, meal_type, quantity }),
  });
  return handleResponse(res);
}

export async function getMessages() {
  const res = await fetch(`${BASE}/api/messages`);
  return handleResponse(res);
}

export async function registerPushToken({ user_id, token }) {
  const res = await fetch(`${BASE}/api/push-tokens`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, token }),
  });
  return handleResponse(res);
}
