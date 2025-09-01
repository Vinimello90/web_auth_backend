const User = require('../models/user');
const Passkey = require('../models/passkey');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');
const { generateToken } = require('../utils/authTokens');
const {
  verifyRegistration,
  getRegistrationOptions,
  getAuthenticationOptions,
  verifyAuthentication,
} = require('../utils/webAuthnService');

module.exports.registerOptions = async (req, res, next) => {
  try {
    const { origin } = req.headers;
    const { username } = req.body;
    const user = (await User.findOne({ username })) || new User({ username });
    const userPasskeys = await Passkey.find({ userID: user._id });
    const options = await getRegistrationOptions(user, userPasskeys, origin);
    req.session.registrationOptions = options;
    req.session.user = user;
    res.status(200).send(options);
  } catch (err) {
    next(err);
  }
};

module.exports.registerVerify = async (req, res, next) => {
  try {
    const { origin } = req.headers;
    const { body } = req;
    const { user } = req.session;
    const { registrationOptions: currentOption } = req.session;
    const verification = await verifyRegistration(body, currentOption.challenge, origin);
    const { verified } = verification;

    if (!verified) {
      throw new UnauthorizedError('error');
    }

    const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;

    const newPasskey = {
      credentialID: credential.id,
      publicKey: Buffer.from(credential.publicKey),
      userID: user._id,
      webauthnUserID: currentOption.user.id,
      counter: credential.counter,
      deviceType: credentialDeviceType,
      backedUp: credentialBackedUp,
      transports: credential.transports,
      expireAt: user.createdAt,
    };
    const checkUser = await User.findOne({ username: user.username });
    if (!checkUser) {
      await User.create(user);
    }
    await Passkey.create(newPasskey);
    res.status(201).send(verified);
  } catch (err) {
    next(err);
  }
};

module.exports.authOptions = async (req, res, next) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({
      username,
    });
    const userPasskeys = await Passkey.find({ userID: user?._id });
    const options = await getAuthenticationOptions(userPasskeys);
    req.session.authenticationOptions = options;
    req.session.userData = user;
    res.status(200).send(options);
  } catch (err) {
    next(err);
  }
};

module.exports.authVerify = async (req, res, next) => {
  try {
    const { origin } = req.headers;
    const response = req.body;
    const user = req.session.userData;
    if (!user?._id) {
      throw new UnauthorizedError('Invalid e-mail or passkey');
    }
    const currentOption = req.session.authenticationOptions;
    const passkey = await Passkey.findOne({ credentialID: response.id }).orFail(() => {
      throw new UnauthorizedError('Invalid e-mail or passkey');
    });
    const verification = await verifyAuthentication(
      response,
      currentOption.challenge,
      passkey,
      origin,
    );
    const { verified, authenticationInfo } = verification;
    if (!verified) {
      throw new UnauthorizedError('Invalid e-mail or passkey');
    }
    await Passkey.findByIdAndUpdate(passkey._id, {
      counter: authenticationInfo.counter,
    });
    const token = generateToken(user);
    res.status(200).send({ token });
  } catch (err) {
    next(err);
  }
};
