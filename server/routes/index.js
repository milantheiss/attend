const express = require('express');
const groupRoute = require('./group.route');
const groupsRoute = require('./groups.route');
const memberRoute = require('./member.route');
const membersRoute = require('./members.route');
const userRoute = require('./user.route');
const usersRoute = require('./users.route');
const attendanceRoute = require('./attendance.route')
const loginRoute = require('./login.route')
const logoutRoute = require('./logout.route')
const authenticationRoute = require('./authentication.route')
const patchNotesRoute = require("./patchnotes.route")
const invoiceRoute = require("./invoice.route")
const notificationRoute = require("./notification.route")
const departmentsRoute = require('./departments.route');
const issueRoute = require("./issue.route")
const authRoute = require("./auth.route")

const router = express.Router();

const defaultRoutes = [
    {
        path: '/group',
        route: groupRoute,
    },
    {
        path: '/groups',
        route: groupsRoute,
    },
    {
        path: '/member',
        route: memberRoute,
    },
    {
        path: '/members',
        route: membersRoute,
    },
    {
        path: '/user',
        route: userRoute,
    },
    {
        path: '/users',
        route: usersRoute,
    },
    {
        path: '/attendance',
        route: attendanceRoute,
    },
    {
        path: '/login',
        route: loginRoute
    },
    {
        path: '/logout',
        route: logoutRoute
    },
    {
        path: '/authenticate',
        route: authenticationRoute
    },
    {
        path: "/patchNotes",
        route: patchNotesRoute
    },
    {
        path: "/invoice",
        route: invoiceRoute
    },
    {
        path: "/notification",
        route: notificationRoute
    },
    {
        path: '/departments',
        route: departmentsRoute,
    },
    {
        path: "/issues",
        route: issueRoute
    },
    {
        path: "/auth",
        route: authRoute
    }
];

const devRoutes = [
    // routes available only in development mode

];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
