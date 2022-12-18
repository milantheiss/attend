const express = require('express');
const groupRoute = require('./group.route');
const memberRoute = require('./member.route');
const attendanceRoute = require('./attendance.route')
const loginRoute = require('./login.route')
const logoutRoute = require('./logout.route')
const authenticationRoute = require('./authentication.route')
const patchNotesRoute = require("./patchnotes.route")
const invoiceRoute = require("./invoice.route")

const router = express.Router();

const defaultRoutes = [
    {
        path: '/groups',
        route: groupRoute,
    },

    //WARNING Unused
    //TODO Auth und Access Controll hinzufügen
    {
        path: '/members',
        route: memberRoute,
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
    }
];

const devRoutes = [
    // routes available only in development mode

];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
