// validationUtils.js
export const isRequired = (value) => value?.trim() !== "";

export const onlyLetters = (value) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(value);

export const isValidNumber = (value, min = 1, max = 150) => {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
};

export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const isValidCURP = (value) => /^[A-Z]{4}\d{6}[HM][A-Z]{5}\d{2}$/i.test(value);

export const isValidPhone = (value) => /^\d{10}$/.test(value);

export const isValidDate = (value) => {
  const date = new Date(value);
  return !isNaN(date.getTime());
};
