const User = require("../models/user.model");
const httpStatusCode = require("../utils/httpStatusCode");
const cloudinary = require("../config/cloudinary.config");
const {
  getProfileUserCache,
  setProfileUserCache,
  clearProfileUserCache,
} = require("./userCache.service");

const getUserProfileService = async (userId) => {
  const cacheData = await getProfileUserCache(userId);
  if (cacheData) {
    return { user: cacheData, source: "redis" };
  }

  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = httpStatusCode.NOT_FOUND;
    throw error;
  }

  await setProfileUserCache(user);
  return { user: user, source: "mongodb" };
};

const updateUserProfileService = async ({ name, phone, file, userId }) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = httpStatusCode.NOT_FOUND;
    throw error;
  }

  user.name = name ?? user.name;
  user.phone = phone ?? user.phone;
  let oldProfileImage = null;
  if (file) {
    if (user.profile_image) {
      oldProfileImage = user.profile_public_id;
    }
    user.profile_image = file.path;
    user.profile_public_id = file.filename;
  }

  await user.save();
  await clearProfileUserCache(user._id);
  await setProfileUserCache(user);
  if (oldProfileImage) {
    await cloudinary.uploader.destroy(oldProfileImage);
  }

  return user;
};

module.exports = { getUserProfileService, updateUserProfileService };
