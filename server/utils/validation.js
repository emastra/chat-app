var isRealString = (str) => {
  return typeof str == 'string' && str.trim().length > 0;
};

var ensureCase = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

module.exports = {isRealString, ensureCase};
