const Joi = require('joi');


const addNewNotification = {
    body: Joi.object().keys({
        title: Joi.string().required(),
        from: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
        message: Joi.string().required(),
        data: Joi.object().required(),
        priority: Joi.string().valid('low', 'normal', 'high').required(),
        recipients: Joi.array().items(Joi.object().keys({
            userID: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
            read: Joi.boolean().required()
        })).required(),
        date: Joi.string().max(10).truncate().optional(),
        type: Joi.string().required()
    })
};

const deleteNotificationById = {
    query: Joi.object().keys({
        id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
    })
};

const deleteManyNotifications = {
    query: Joi.object().keys({
        ids: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()).required()
    })
};

const markNotificationAsRead = {
    query: Joi.object().keys({
        id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
    })
};

const markManyNotificationsAsRead = {
    query: Joi.object().keys({
        ids: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()).required()
    })
};

const markNotificationAsUnread = {
    query: Joi.object().keys({
        id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
    })
};

const markManyNotificationsAsUnread = {
    query: Joi.object().keys({
        ids: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()).required()
    })
};

module.exports = {
    addNewNotification,
    deleteNotificationById,
    deleteManyNotifications,
    markNotificationAsRead,
    markManyNotificationsAsRead,
    markNotificationAsUnread,
    markManyNotificationsAsUnread
};