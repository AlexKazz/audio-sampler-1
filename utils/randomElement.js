// utils/randomElement.js
const randomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

export default randomElement;
