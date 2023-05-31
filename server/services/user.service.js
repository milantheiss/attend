const httpStatus = require("http-status");
const { default: mongoose } = require("mongoose");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");
const nanoid = require("nanoid");
const { groupService } = require(".");

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


    if (user.accessible_groups.length > updateBody.accessible_groups.length) {
        //Remove Member from Group
        const removedGroups = user.accessible_groups.filter(group => !updateBody.accessible_groups.includes(group))
        for (groupId of removedGroups) {
            await groupService.removeTrainer(groupId, user._id)
        }
    } else if (user.accessible_groups.length < updateBody.accessible_groups.length) {
        //Add Member to Group
        const newGroups = updateBody.accessible_groups.filter(group => !user.accessible_groups.includes(group))
        for (groupId of newGroups) {
            await groupService.addTrainer(groupId, {id: user._id, role: user.roles.includes("trainer") ? "trainer" : "assistant"})
        }
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
	for (groupID of user.accessible_groups) {
		await groupService.deleteTrainer(groupID, userID);
	}

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
