const User = require('../models/user');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');
const passkey = require('../models/passkey');

module.exports.createUser = async (req, res, next) => {
  try {
    const { username } = req.body;
    const newUser = await User.create({ username });
    req.session.userId = newUser._id;
    res.status(201).send({ username: newUser.username });
  } catch (err) {
    next(err);
  }
};

module.exports.getMe = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id).orFail(() => {
      throw new UnauthorizedError('User not found. Please Login again.');
    });
    const passkeys = await passkey.find({ userID: _id });
    if (passkeys.length > 0) {
      res.status(200).send({ user, hasPasskey: true });
    } else {
      req.session.userId = _id;
      res.status(200).send({ user, hasPasskey: false });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
