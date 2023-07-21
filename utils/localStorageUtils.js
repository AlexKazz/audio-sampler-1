export const getAllLocalStorageItems = () => {
  if (typeof window === "undefined") {
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
