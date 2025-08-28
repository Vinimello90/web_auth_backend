const router = require('express').Router();
const {
  registerOptions,
  registerVerify,
  authOptions,
  authVerify,
} = require('../controllers/passkeys');
const { validateUser } = require('../middlewares/validators/usersValidators');

router.post('/register/options', validateUser, registerOptions);
router.post('/register/verify', registerVerify);
router.post('/authentication/options', validateUser, authOptions);
router.post('/authentication/verify', authVerify);

module.exports = router;
