import User from "../models/User.js";

// =======================
// save user google tokens
// =======================
export const saveUserTokens = async (googleId, tokens) => {
  const user = await User.findOneAndUpdate(
    { googleId },
    { $set: { tokens } },
    { new: true }
  );

  return user ? user : null;
};

export const getUserTokens = async (googleId) => {
  const user = await User.findOne({ googleId });
  return user ? user.tokens : null;
};

// =======================
// update user with google tokens
// =======================
export const updateUserWithTokens = async (email, googleId, tokens) => {
  await User.findOneAndUpdate(
    { email },
    {
      $set: {
        googleId,
        "tokens.accessToken": tokens.accessToken,
        "tokens.refreshToken": tokens.refreshToken || "",
      },
    },
    { new: true }
  );
};
