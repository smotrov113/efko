
export const convertIntSeparator = (value) => {
  value = value ? value : 0;
  const param = { minimumFractionDigits: 2 };
  return value.toLocaleString('en-US', {...param}).replace(/,/g, ' ');
}

export const isObject = (value) => {
  return value !== undefined && value !== null && value.constructor === Object;
}

export const getRandonKey = (length = 10) => {
  let result = '';
  const dictionary = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const dictionaryLength = dictionary.length;
  for (let i = 0; i < length; i++) {
     result += dictionary.charAt(Math.floor(Math.random() * dictionaryLength));
  }
  return result;
}

export const getRandonString = (length = 10) => {
  let result = '';
  const dictionary = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const dictionaryLength = dictionary.length;
  for (let i = 0; i < length; i++) {
     result += dictionary.charAt(Math.floor(Math.random() * dictionaryLength));
  }
  return result;
}

export const hex2rgba = (hex, alpha = 1) => {
  hex = hex.replace('#', '');
  let r = parseInt(hex.length == 3 ? hex.slice(0, 1).repeat(2) : hex.slice(0, 2), 16);
  let g = parseInt(hex.length == 3 ? hex.slice(1, 2).repeat(2) : hex.slice(2, 4), 16);
  let b = parseInt(hex.length == 3 ? hex.slice(2, 3).repeat(2) : hex.slice(4, 6), 16);
  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
};