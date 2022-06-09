const express = require('express');
const groupRoute = require('./group.route');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/groups',
        route: groupRoute,
    }
];

const devRoutes = [
    // routes available only in development mode

];

defaultRoutes.forEach((route) => {
    console.log(route.route)
    router.use(route.path, route.route);
});

module.exports = router;
