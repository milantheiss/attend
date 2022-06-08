const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
//TODO Update Schema to real GroupSchema
        task: 'string',
        assignee: 'string',
        status: 'string',
        createDate: 'date',
        updatedDate: 'date',
        createdBy: 'string',
        updatedBy: 'string'
    },
    {timestamps: {createDate: 'created_at', updatedDate: 'updated_at'}});

const GroupModel = mongoose.model('group', groupSchema);

module.exports = {
    Group: GroupModel
}
