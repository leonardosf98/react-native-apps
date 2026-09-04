import * as SecureStore from "expo-secure-store";

const KEY = "aether.token";
let memoryToken = null;

export async function saveToken(token) {
  memoryToken = token;
  try {
    await SecureStore.setItemAsync(KEY, token);
  } catch {
    return;
  }
}

export async function loadToken() {
  if (memoryToken) return memoryToken;
  try {
    memoryToken = await SecureStore.getItemAsync(KEY);
    return memoryToken;
  } catch {
    return null;
  }
}

export async function clearToken() {
  memoryToken = null;
  try {
    await SecureStore.deleteItemAsync(KEY);
  } catch {
    return;
  }
}
