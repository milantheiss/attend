const httpStatus = require("http-status");
const { default: mongoose } = require("mongoose");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");
const nanoid = require("nanoid");

/**
 * Get all members.
 * @param {mongoose.Types.ObjectId}
 * @returns {User}
 */
const getUserInfo = async (userID) => {
	const user = await User.findById(userID);
	return {
		email: user.email,
		firstname: user.firstname,
		lastname: user.lastname,
	};
};

const getUserById = async (userID) => {
	return await User.findById(userID);
};

const getUsers = async () => {
	return await User.find({});
};

const createUser = async (userBody) => {
	if (await User.isEmailTaken(userBody.email)) {
		throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
	}

	if (await User.isUsernameTaken(userBody.username)) {
		throw new ApiError(httpStatus.BAD_REQUEST, "Username already taken");
	}

	const password = nanoid.nanoid(10);

	console.log(password);

	//TODO Add send email with password

	userBody.password = password;

	return await User.create(userBody);
}

const updateUser = async (userID, updateBody) => {
	const user = await getUserById(userID);

	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found");
	}

	if (updateBody.email && (await User.isEmailTaken(updateBody.email, userID))) {
		throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
	}

	if (updateBody.username && (await User.isUsernameTaken(updateBody.username, userID))) {
		throw new ApiError(httpStatus.BAD_REQUEST, "Username already taken");
	}

	Object.assign(user, updateBody);
	await user.save();
	return user;
};

const deleteUser = async (userID) => {
	const user = await getUserById(userID);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found");
	}

	//TODO Delete all groups,notifications, invoices where user is involved
	await user.remove();
	return user;
};

module.exports = {
	getUserInfo,
	getUserById,
	getUsers,
	createUser,
	deleteUser,
	updateUser
};
