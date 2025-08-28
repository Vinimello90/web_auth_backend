const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.generateToken = function generateToken(user) {
  return jwt.sign(
    {
      _id: user?._id,
    },
    NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    {
      expiresIn: '1d',
    },
  );
};

module.exports.verifyToken = function verifyToken(token) {
  return jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
};
