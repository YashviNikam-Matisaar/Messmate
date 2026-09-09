import { API_BASE_URL } from '@env';

const BASE = API_BASE_URL;

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

// Pass either or both flags — only the ones provided get updated.
export async function setLeaveStatus(userId, { lunch_leave, dinner_leave }) {
  const body = {};
  if (typeof lunch_leave === 'boolean') body.lunch_leave = lunch_leave;
  if (typeof dinner_leave === 'boolean') body.dinner_leave = dinner_leave;

  const res = await fetch(`${BASE}/api/users/${userId}/leave-status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}