const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    profilePic: {
      type: String,
      default: '',
    },
  },
  // createdAt과 updatedAt을 자동으로 생성
  { timestamps: true },
);

UserSchema.plugin(passportLocalMongoose, {
  usernameField: 'username',
});

module.exports = mongoose.model('User', UserSchema);
