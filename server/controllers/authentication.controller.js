const logger = require("../config/logger");
const { authenticationService } = require("../services");
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const config = require("../config/config");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

/**
 * Nimmt Login Daten an und versucht User einzuloggen.
 * Wenn successfull wird ein JWT Token returned
 * @param  {} req from POST
 * @returns On Success JWT Token
 */
const login = catchAsync(async (req, res) => {
	// Our login logic starts here
	try {
		// Get user input
		const { username, password } = req.body;

		// Validate user input
		if (!(username && password)) {
			return res.status(400).send("All input is required");
		}

		// Validate if user exist in our database
		const user = await authenticationService.getUserByUsername(username);

		if (user && (await bcrypt.compare(password, user.password))) {
			// Create access token
			const access_token = jwt.sign({ user_id: user._id, username: user.username }, config.secret, {
				expiresIn: "15min",
			});

			//Neues refresh secret wird in User kreiiert

			const new_secret = require("crypto").randomBytes(256).toString("base64");
			const secret_id = new mongoose.Types.ObjectId();

			await authenticationService.addRefreshToken(user._id, { secret: new_secret, _id: secret_id });

			// Create refresh token
			const refresh_token = jwt.sign({ user_id: user._id, username: user.username, token_id: secret_id }, new_secret, {
				expiresIn: "7d",
			});
		

			const response = {
				user: {
					username: user.username,
					firstname: user.firstname,
					lastname: user.lastname,
					_id: user._id,
					lengthAccessibleGroups: user.accessible_groups.length 
				},
				showPatchNotesDialog: !user.readPatchnotes,
			};

			logger.debug("Successfull Login");

			// user
			return res
				.cookie("access_token", access_token, {
					expires: new Date(Date.now() + 600000),
					secure: true,
					httpOnly: true,
					sameSite: config.sameSite,
				})
				.cookie("refresh_token", refresh_token, {
					expires: new Date(Date.now() + 604800000),
					secure: true,
					httpOnly: true,
					sameSite: config.sameSite,
				})
				.status(httpStatus.OK)
				.send(response);
		}
		return res.status(httpStatus.BAD_REQUEST).send("Invalid Credentials");
	} catch (err) {
		logger.error(err);
	}
});

/**
 * Logget User aus. Hierzu wird Cookie im Client gelöscht
 * und Token invalidiert
 * @param  {}
 * @returns
 */
const logout = catchAsync(async (req, res) => {
	// Our login logic starts here
	try {
		// user
		const refresh_token = req.cookies.refresh_token;

		const decoded = jwt.decode(refresh_token);

		try {
			authenticationService.deleteRefreshToken(decoded.user_id, decoded.token_id);
		} catch (err) {
			//WARNING Es wird ein Error geworfen wenn z.B. kein Refresh Token übergeben wird
			//TODO Aufräum Methode implementieren, mit der alle Expired Refresh Tokenes gecleared werden
			if (typeof user_id === "undefined" || typeof token_id === "undefined") {
				logger.warn("No refresh token provided during logout");
				return res
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
					.status(httpStatus.OK)
					.send("No refresh token cleared because no refresh token was provided");
			}
		}

		logger.debug("Logged out");
		return res
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
			.status(httpStatus.OK)
			.send("Successfully logged out");
	} catch (err) {
		logger.error(err);
	}
});

const authenticate = catchAsync(async (req, res) => {
	let access_token = req.cookies.access_token;
	const refresh_token = req.cookies.refresh_token;

	if (!access_token) {
		if (refresh_token) {
			access_token = await getNewToken(req, res, refresh_token);
		} else {
			return res.status(httpStatus.UNAUTHORIZED).send("Logout");
		}
	}

	try {
		if (typeof access_token !== "undefined") {
			const decrypt = jwt.verify(access_token, config.secret);
			const user = await authenticationService.getUserById(decrypt.user_id);
			const response = {
				user: {
					username: user.username,
					firstname: user.firstname,
					lastname: user.lastname,
					_id: user._id,
					lengthAccessibleGroups: user.accessible_groups.length 
				},
				showPatchNotesDialog: !user.readPatchnotes,
			};
			return res.status(httpStatus.OK).send(response);
		} else {
			return res
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
				.status(httpStatus.UNAUTHORIZED)
				.send("Logout");
		}
	} catch (err) {
		logger.error(err.toString());
		return new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Token is invalid");
	}
});

const getNewToken = async (req, res, old_refresh_token) => {
	const decoded = jwt.decode(old_refresh_token);

	const secret = await authenticationService.getRefreshTokenSecret(decoded.user_id, decoded.token_id);

	if (typeof secret === "undefined") {
		res
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
			.status(httpStatus.UNAUTHORIZED)
			.send("Logout");
		//TODO Auto redirect
		return undefined;
	}

	try {
		const decrypt = jwt.verify(old_refresh_token, secret);

		const access_token = jwt.sign({ user_id: decrypt.user_id, username: decrypt.username }, config.secret, {
			expiresIn: "15min",
		});

		await authenticationService.deleteRefreshToken(decrypt.user_id, decrypt.token_id);

		const new_secret = require("crypto").randomBytes(256).toString("base64");
		await authenticationService.addRefreshToken(decrypt.user_id, { secret: new_secret, _id: decrypt.token_id });

		// Create refresh token
		const refresh_token = jwt.sign({ user_id: decrypt.user_id, username: decrypt.username, token_id: decrypt.token_id }, new_secret, {
			expiresIn: "7d",
		});

		res
			.cookie("access_token", access_token, {
				expires: new Date(Date.now() + 600000),
				secure: true,
				httpOnly: true,
				sameSite: config.sameSite,
			})
			.cookie("refresh_token", refresh_token, {
				expires: new Date(Date.now() + 604800000),
				secure: true,
				httpOnly: true,
				sameSite: config.sameSite,
			});

		return access_token;
	} catch (err) {
		logger.error(err.toString());
		return undefined;
		throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Token is invalid");
	}
};

module.exports = {
	login,
	logout,
	authenticate,
};
