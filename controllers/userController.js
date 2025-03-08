import User from "../models/User.js";
import { encrypt, decrypt } from "../utils/crypto.js";
import responseHandler from "../middlewares/responseHandler.js";

// @route   GET /api/v1/users/profile/:userId
// @desc    Gets a user's profile
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return next({ statusCode: 400, message: "User not found" });

    const profile = {
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };

    responseHandler(res, profile, "User profile retrieved!");
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/v1/users/apikeys
// @desc    Stores a user's api keys
export const storeApiKeys = async (req, res, next) => {
  try {
    const { userId, apiKeys } = req.body; // apiKeys = [{ provider, key }]

    const encryptedKeys = apiKeys.map(({ provider, key }) => ({
      provider,
      key: encrypt(key),
    }));

    await User.findByIdAndUpdate(userId, {
      $push: { apiKeys: { $each: encryptedKeys } },
    });

    responseHandler(res, null, "API Keys stored successfully!");
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/v1/users/apikeys/:userId
// @desc    Gets a user's api keys
export const getApiKeys = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return next({ statusCode: 400, message: "User not found" });

    const decryptedKeys = user.apiKeys.map(({ provider, key }) => ({
      provider,
      key: decrypt(key),
    }));

    responseHandler(res, decryptedKeys, "API Keys retrieved successfully!");
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/v1/users/apikeys
// @desc    Updates a user's api keys
export const updateApiKeys = async (req, res) => {
  try {
    const { userId, provider, newKey } = req.body;
    const encryptedKey = crypto.encrypt(newKey);

    await User.updateOne(
      { _id: userId, "apiKeys.provider": provider },
      { $set: { "apiKeys.$.key": encryptedKey } }
    );

    responseHandler(res, null, "API Key updated successfully!");
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/v1/users/apikeys
// @desc    Deletes a user's api keys
export const deleteApiKeys = async (req, res, next) => {
  try {
    const { userId, provider } = req.body;

    await User.updateOne({ _id: userId }, { $pull: { apiKeys: { provider } } });

    responseHandler(res, null, "API Key deleted successfully!");
  } catch (error) {
    next(error);
  }
};
