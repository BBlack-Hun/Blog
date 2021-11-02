const CryptoJS = require('crypto-js');

module.exports.encrpt = (password) => {
  return CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString();
};

module.exports.decrpt = (password) => {
  return CryptoJS.AES.decrypt(password, process.env.PASS_SEC).toString(
    CryptoJS.enc.Utf8,
  );
};
