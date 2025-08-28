const { celebrate, Joi } = require('celebrate');

module.exports.validateUser = celebrate({
  body: Joi.object().keys({
    username: Joi.string().required().min(1).max(30),
  }),
});
