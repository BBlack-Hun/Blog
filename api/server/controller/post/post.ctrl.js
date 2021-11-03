const Post = require('../../models/Post');
const { encrpt, decrpt } = require('../../helper/passwordHash');

exports.post_post = async (req, res) => {
  const sesionUser = req.session.passport.user;
  if (sesionUser === req.body.username) {
    const newPost = new Post(req.body);
    try {
      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
    } catch (e) {
      res.status(500).json(e);
    }
  } else {
    res.status(401).json('You can post only your account!');
  }
};

exports.update_post = async (req, res) => {};

exports.delete_post = async (req, res) => {};

exports.get_post = async (req, res) => {};
