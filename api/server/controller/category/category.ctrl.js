const Category = require('../../models/Category');

exports.post_category = async (req, res) => {
  const newCat = new Category(req.body);
  try {
    const savedCat = await newCat.save();
    res.status(200).json(savedCat);
  } catch (e) {
    res.status(500).json(e);
  }
};

exports.get_category = async (req, res) => {
  try {
    const cats = await Category.find();
    res.status(200).json(cats);
  } catch (e) {
    res.status(500).json(e);
  }
};
