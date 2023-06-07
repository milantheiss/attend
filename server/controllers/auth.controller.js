const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService } = require('../services');
const config = require('../config/config');

const login = catchAsync(async (req, res) => {
	const { email, password } = req.body;
	const user = await authService.loginUserWithEmailAndPassword(email, password);
	const tokens = await tokenService.generateAuthTokens(user);

	const response = {
		user: {
			username: user.username,
			firstname: user.firstname,
			lastname: user.lastname,
			_id: user._id,
			lengthAccessibleGroups: user.accessible_groups.length,
			roles: user.roles,
			email: user.email
		},
		showPatchNotesDialog: !user.readPatchnotes,
	};


	res
		.cookie("access_token", tokens.access, {
			expires: new Date(Date.now() + config.jwt.accessExpirationMinutes * 60 * 1000),
			secure: true,
			httpOnly: true,
			sameSite: config.sameSite,
		})
		.cookie("refresh_token", tokens.refresh, {
			expires: new Date(Date.now() + config.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000),
			secure: true,
			httpOnly: true,
			sameSite: config.sameSite,
		})
		.send(response);
});

const logout = catchAsync(async (req, res) => {
	await authService.logout(req.body.refreshToken);
	res
		.status(httpStatus.NO_CONTENT)
		.clearCookie("access_token", {
			secure: true,
			httpOnly: true,
			sameSite: config.sameSite,
		})
		.clearCookie("refresh_token", {
			secure: true,
			httpOnly: true,
			sameSite: config.sameSite,
		})
		.send();
});

const updatePassword = catchAsync(async (req, res) => {
	await authService.updatePassword(req.body.oldPassword, req.body.newPassword, req.user);
	res.status(httpStatus.NO_CONTENT).send();
});

const resendPassword = catchAsync(async (req, res) => {
	await authService.resendPassword(req.query.token, req.body.password);
	res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
	login,
	logout,
	updatePassword,
	resendPassword,
};