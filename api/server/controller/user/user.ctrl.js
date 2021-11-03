const User = require('../../models/User');
const Post = require('../../models/Post');
const { encrpt, decrpt } = require('../../helper/passwordHash');

exports.update_user = async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      req.body.password = await encrpt(req.body.password);
    }
    try {
      const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true },
      );
      const { password, ...others } = updateUser._doc;
      res.status(200).json(others);
    } catch (e) {
      res.status(500).json(e);
    }
  } else {
    res.status(401).json('You can update only your account!');
  }
};

exports.delete_user = async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      if (user) {
        try {
          await Post.deleteMany({
            username: user.username,
          });
          await User.findByIdAndDelete(req.params.id);
          res.status(200).json('User has been deleted...');
        } catch (e) {
          res.status(500).json(e);
        }
      }
    } catch (e) {
      res.sataus(400).json('User not found');
    }
  } else {
    res.status(401).json('You can delete only your account!');
  }
};
