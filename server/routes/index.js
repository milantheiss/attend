const express = require('express');
const groupRoute = require('./group.route');
const memberRoute = require('./member.route');
const attendanceRoute = require('./attendance.route')

const router = express.Router();

const defaultRoutes = [
    {
        path: '/groups',
        route: groupRoute,
    },
    {
        path: '/members',
        route: memberRoute,
    },
    {
        path: '/attendance',
        route: attendanceRoute,
    },
];

const devRoutes = [
    // routes available only in development mode

];

defaultRoutes.forEach((route) => {
    console.log(route.route)
    router.use(route.path, route.route);
});

module.exports = router;
