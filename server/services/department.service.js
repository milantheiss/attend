const { Department } = require('../models');

const getDepartments = async () => {
    return Department.find({}, {name: 1, _id: 1});
}

module.exports = {
    getDepartments
};