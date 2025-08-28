const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} = require('@simplewebauthn/server');
const { isoUint8Array } = require('@simplewebauthn/server/helpers');

const { WEBAUTHN_RP_NAME, WEBAUTHN_RP_ID } = process.env;

module.exports = {
  getRegistrationOptions(user, userPasskeys, origin) {
    return generateRegistrationOptions({
      rpName: WEBAUTHN_RP_NAME,
      rpID: WEBAUTHN_RP_ID,
      origin: origin,
      userName: user.username,
      userDisplayName: user.username,
      userID: isoUint8Array.fromUTF8String(user._id),
      attestationType: 'none',
      excludeCredentials: userPasskeys.map((passkey) => ({
        id: passkey.credentialID,
        transports: passkey.transports,
      })),
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
      },
    });
  },

  verifyRegistration(response, expectedChallenge, origin) {
    return verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: WEBAUTHN_RP_ID,
      requireUserVerification: false,
    });
  },

  getAuthenticationOptions(userPasskeys) {
    return generateAuthenticationOptions({
      rpID: WEBAUTHN_RP_ID,
      allowCredentials: userPasskeys.map((passkey) => ({
        id: passkey.credentialID,
        transports: passkey.transports,
      })),
    });
  },

  verifyAuthentication(response, challenge, passkey, origin) {
    return verifyAuthenticationResponse({
      response,
      expectedChallenge: challenge,
      expectedOrigin: origin,
      expectedRPID: WEBAUTHN_RP_ID,
      credential: {
        id: passkey.credentialID,
        publicKey: new Uint8Array(passkey.publicKey),
        counter: passkey.counter,
        transports: passkey.transports,
      },
      requireUserVerification: false,
    });
  },
};
