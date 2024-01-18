import { ServerResponse } from "http";

export const generateToken = () => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_+=";
  const tokenLength = 16;

  let token = "";
  for (let i = 0; i < tokenLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }

  return token;
};

export const isValidCard = (cardNumber: number) => {
  const digits = String(cardNumber).split("").map(Number).reverse();

  let sum = 0;

  for (let i = 0; i < digits.length; i++) {
    let digit = digits[i];

    if (i % 2 !== 0) {
      digit *= 2;
      digit -= digit > 9 ? 9 : 0;
    }

    sum += digit;
  }

  return sum % 10 === 0;
};

export const isValidExpirationMonth = (experiteMonth: string) => {
  const fieldValue = parseInt(experiteMonth, 10);

  return (
    experiteMonth.length <= 2 &&
    !isNaN(fieldValue) &&
    fieldValue >= 1 &&
    fieldValue <= 12
  );
};

export const isValidExpirationYear = (expirationYear: number) => {
  const currentYear = new Date().getFullYear();
  const allowedYears = 5;

  return (
    expirationYear >= currentYear &&
    expirationYear <= currentYear + allowedYears
  );
};

export const isValidEmail = (email: string) => {
  const validEmailDomains = ["gmail.com", "hotmail.com", "yahoo.es"];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return false;
  }

  const [, domain] = email.split("@");
  return validEmailDomains.includes(domain);
};

export const sendErrorResponse = (
  res: ServerResponse,
  status: number,
  message?: { [key: string]: string },
  errors?: { [key: string]: string }
) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ status, message, errors }));
};
