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
    // 이 부분 수정 필요 -> 로그인 세션이랑 계정이랑 같아야 글을 쓸 수 있다는게 아님... 로그인 시, 동일한 세션에서 글을 쓸 수 있다는 것임
    res.status(401).json('You can post only your account!');
  }
};

exports.update_post = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
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
