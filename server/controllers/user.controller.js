const {userService} = require('../services')
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { hasAdminRole, hasStaffAccess } = require('../utils/roleCheck');

const getUsers = catchAsync(async (req, res) => {
    if(!hasStaffAccess(req.user)) {
        return res.status(httpStatus.FORBIDDEN).send({message: "You don't have access to this resource"})
    }
    res.send(await userService.getUsers())
});

const getUserById = catchAsync(async (req, res) => {
    if(!hasAdminRole(req.user)) {
        return res.status(httpStatus.FORBIDDEN).send({message: "You don't have access to this resource"})
    }
    res.send(await userService.getUserById(req.params.id))
});

const createUser = catchAsync(async (req, res) => {
    if(!hasAdminRole(req.user)) {
        return res.status(httpStatus.FORBIDDEN).send({message: "You don't have access to this resource"})
    }
    const result = await userService.createUser(req.body);
    res.status(httpStatus.CREATED).send(result) 
});

const updateUser = catchAsync(async (req, res) => {
    if(!hasAdminRole(req.user)) {
        return res.status(httpStatus.FORBIDDEN).send({message: "You don't have access to this resource"})
    }
    const result = await userService.updateUser(req.params.id, req.body)
    res.status(httpStatus.OK).send(result)
})

const deleteUser = catchAsync(async (req, res) => {
    if(!hasAdminRole(req.user)) {
        return res.status(httpStatus.FORBIDDEN).send({message: "You don't have access to this resource"})
    }
    const result = await userService.deleteUser(req.params.id)
    res.status(httpStatus.OK).send(result)
})

const resendPassword = catchAsync(async (req, res) => {
    if(!hasAdminRole(req.user)) {
        return res.status(httpStatus.FORBIDDEN).send({message: "You don't have access to this resource"})
    }
    const result = await userService.resendPassword(req.params.id)
    res.status(httpStatus.NO_CONTENT).send()
})

const updateSelf = catchAsync(async (req, res) => {
    // Durch die Validation kann body nur Firstname, Lastname & Email enthalten
    const result = await userService.updateUser(req.user._id, req.body)
    res.status(httpStatus.OK).send(result)
})

const changePassword = catchAsync(async (req, res) => {
    // Durch die Validation kann body nur Firstname, Lastname & Email enthalten
    const user = await userService.getUserById(req.user._id)

    if(!user) {
        return res.status(httpStatus.NOT_FOUND).send({message: "Benutzer nicht gefunden"})
    }
    if(!await user.isPasswordMatch(req.body.old)) {
        return res.status(httpStatus.BAD_REQUEST).send({message: "Altes Passwort falsch!"})
    }

    user.password = req.body.new
    await user.save()
    res.status(httpStatus.NO_CONTENT).send()
})

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    resendPassword,
    updateSelf,
    changePassword
}

