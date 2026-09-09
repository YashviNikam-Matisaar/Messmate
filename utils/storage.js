import AsyncStorage from '@react-native-async-storage/async-storage';

const NAME_KEY = 'messmate_user_name';
const USER_ID_KEY = 'messmate_user_id';
const IS_ADMIN_KEY = 'messmate_is_admin';

export async function getSavedName() {
  try {
    return await AsyncStorage.getItem(NAME_KEY);
  } catch (err) {
    console.error('Failed to read saved name:', err);
    return null;
  }
}

export async function saveName(name) {
  try {
    await AsyncStorage.setItem(NAME_KEY, name);
  } catch (err) {
    console.error('Failed to save name:', err);
  }
}

export async function getSavedUserId() {
  try {
    return await AsyncStorage.getItem(USER_ID_KEY);
  } catch (err) {
    console.error('Failed to read saved user id:', err);
    return null;
  }
}

export async function saveUserId(id) {
  try {
    await AsyncStorage.setItem(USER_ID_KEY, id);
  } catch (err) {
    console.error('Failed to save user id:', err);
  }
}

export async function getSavedIsAdmin() {
  try {
    const value = await AsyncStorage.getItem(IS_ADMIN_KEY);
    return value === 'true';
  } catch (err) {
    console.error('Failed to read admin flag:', err);
    return false;
  }
}

export async function saveIsAdmin(isAdmin) {
  try {
    await AsyncStorage.setItem(IS_ADMIN_KEY, isAdmin ? 'true' : 'false');
  } catch (err) {
    console.error('Failed to save admin flag:', err);
  }
}
