var isRealString = (str) => {
  return typeof str === 'string' && str.trim().length > 0; //will return true or false, the trim gets rid of leading and trailing spaces
};

module.exports = {
  isRealString
};
