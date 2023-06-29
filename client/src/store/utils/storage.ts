export const getStorageValue = <T>(key: string) => {
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? "") as T;
  } catch (e) {
    return null;
  }
};

export const appendToStorage = <T>(key: string, item: T) => {
  try {
    const arr: T[] = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    const tmp = [{ ...item }, ...arr];
    const result = JSON.stringify(tmp);
    window.localStorage.setItem(key, result);
  } catch (e) {
    return null;
  }
};

export const saveToStorage = <T>(key: string, item: T) => {
  const tmp = JSON.stringify(item);
  window.localStorage.setItem(key, tmp);
};
