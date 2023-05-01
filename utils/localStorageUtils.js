// localStorageUtils.js
export const getAllLocalStorageItems = () => {
  if (typeof window === "undefined") {
    // Not on the client-side, return an empty array
    return [];
  }

  const items = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = JSON.parse(localStorage.getItem(key));
    const timestamp = value.timestamp;
    items.push({ key, value, timestamp });
  }

  return items;
};
