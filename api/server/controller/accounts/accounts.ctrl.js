const User = require('../../models/User');
const { encrpt, decrpt } = require('../../helper/passwordHash');
const jwt = require('jsonwebtoken');

exports.post_register = async (req, res) => {
  req.body.profilePic = req.file ? req.file.filename : '';
  try {
    const hashPw = await encrpt(req.body.password);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPw,
      isAdmin: req.body.isAdmin,
      profilePic: req.body.profilePic,
    });
    const user = await User.register(newUser, hashPw);

    const { password, ...others } = user._doc;

    res.status(200).json(others);
  } catch (e) {
    res.status(500).json(e);
  }
};

exports.post_login = async (req, res) => {
  console.log('wait for Session!!');
  // db를 통한 검증 -> passport를 사용한 검증으로 변경 예정!
  try {
    const user = await User.findOne({
      username: req.body.username,
    });

    !user && res.ststus(400).json(`Wrong crendentials!`);

    const hashPw = await decrpt(user.password);

    hashPw !== req.body.password && res.status(401).json(`Wrong crendentials!`);

    const accesstoken = jwt.sign(
      {
        username: user.username,
      },
      process.env.JWT_SEC,
      { expiresIn: '3d' },
    );

    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accesstoken });
  } catch (e) {
    res.status(500).json(e);
  }
};

exports.get_logout = (req, res) => {
  req.logout();
  req.session.destroy();
  res.clearCookie();

  res.status(200).json('Logout!');
};
