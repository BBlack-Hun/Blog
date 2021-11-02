const { CryptoJS } = require('crypto-js');

module.exports = (password) => {
  return CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString();
};
