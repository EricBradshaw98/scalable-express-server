const camelCase = (str) => {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
};

const camelCaseKeys = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((item) => camelCaseKeys(item));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((acc, key) => {
      acc[camelCase(key)] = camelCaseKeys(obj[key]);
      return acc;
    }, {});
  }
  return obj;
};

module.exports = camelCaseKeys;
