const User = require('../../models/User');
const { encrpt, decrpt } = require('../../helper/passwordHash');
const jwt = require('jsonwebtoken');

exports.post_register = async (req, res) => {
  console.log('test');
  req.body.profilePic = req.file ? req.file.filename : '';
  console.log(req.body);
  try {
    const hashPw = await encrpt(req.body.password);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPw,
      isAdmin: req.body.isAdmin,
      profilePic: req.body.profilePic,
    });
    console.log('222222222');
    const user = await newUser.save();
    console.log('3333333');
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
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: '3d' },
    );

    res.cookie('accesstoken', 'bearer ' + accesstoken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accesstoken });
  } catch (e) {
    res.status(500).json(e);
  }
};

exports.get_logout = (req, res) => {
  req.logout();
  req.session.destroy();
  res.clearCookie('connect.sid');

  res.status(200).json('Logout!');
};
