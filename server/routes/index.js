const express = require('express');
const groupRoute = require('./group.route');
const groupsRoute = require('./groups.route');
const memberRoute = require('./member.route');
const membersRoute = require('./members.route');
const attendanceRoute = require('./attendance.route')
const loginRoute = require('./login.route')
const logoutRoute = require('./logout.route')
const authenticationRoute = require('./authentication.route')
const patchNotesRoute = require("./patchnotes.route")
const invoiceRoute = require("./invoice.route")
const notificationRoute = require("./notification.route")

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
    }
];

const devRoutes = [
    // routes available only in development mode

];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
