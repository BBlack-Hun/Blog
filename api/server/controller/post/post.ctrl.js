const Post = require('../../models/Post');
const { encrpt, decrpt } = require('../../helper/passwordHash');

exports.post_post = async (req, res) => {
  req.body.photo = req.file ? req.file.filename : '';
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (e) {
    res.status(500).json(e);
  }
};

exports.update_post = async (req, res) => {
  const fs = require('fs');
  const path = require('path');
  const uploadDir = path.join(__dirname, '../../uploads');

  try {
    const post = await Post.findById(req.params.id);

    if (req.file && shop.photo) {
      fs.unlinkSync(uploadDir + '/' + post.photo + '_' + post.username);
    }
    req.body.photo = req.file ? req.file.filename : shop.photo;
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true },
        );
        res.status(200).json(updatedPost);
      } catch (e) {
        res.status(500).json(e);
      }
    } else {
      res.ststus(401).json('You can update only your post!');
    }
  } catch (e) {
    res.status(500).json(e);
  }
};

exports.delete_post = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        await post.delete();
        res.status(200).json('post bas been deleted..');
      } catch (err) {
        res.ststus(500).json(err);
      }
    } else {
      res.ststus(401).json('You can delete only your post!');
    }
  } catch (e) {
    res.status(500).json(e);
  }
};

exports.get_post = async (req, res) => {
  try {
    const post = await Pos.findById(req.params.id);
    res.status(200).json(post);
  } catch (e) {
    res.status(500).json(e);
  }
};

exports.get_posts = async (req, res) => {
  const username = req.query.user;
  const catName = req.qeury.cat;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (e) {
    res.status(500).json(e);
  }
};
