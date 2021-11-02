const User = require('../../models/User');
const { encrpt, decrpt } = require('../../helper/passwordHash');

exports.post_register = async (req, res) => {
  try {
    const hashPw = await encrpt(req.body.password);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPw,
    });
    const user = await newUser.save();

    const { password, ...others } = user._doc;

    res.status(200).json(others);
  } catch (e) {
    res.status(500).json(e);
  }
};

exports.post_login = async (req, res) => {
  // db를 통한 검증 -> passport를 사용한 검증으로 변경 예정!
  try {
    const user = await User.findOne({
      username: req.body.username,
    });

    !user && res.ststus(400).json(`Wrong crendentials!`);

    const hashPw = await decrpt(user.password);

    hashPw !== req.body.password && res.status(401).json(`Wrong crendentials!`);

    const { password, ...others } = user._doc;

    res.status(200).json(others);
  } catch (e) {
    res.status(500).json(e);
  }
};
