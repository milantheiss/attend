const taskService  = require('../service/task.service');
const logger = require('../config/logger');

class GroupController {
    //TODO Update Code from Boilerplate
    //Im Controller sollen die gegebenen Daten verarbeitet werden und mit der DB ausgetauscht werden.

    async getTasks() {
        logger.info('Controller: getTasks')
        return await taskService.getTasks();
    }

    async createTask(task) {
        logger.info('Controller: createTask', task);
        return await taskService.createTask(task);
    }

    async updateTask(task) {
        logger.info('Controller: updateTask', task);
        return await taskService.updateTask(task);
    }

    async deleteTask(taskId) {
        logger.info('Controller: deleteTask', taskId);
        return await taskService.deleteTask(taskId);
    }
}
module.exports = new GroupController();

// TODO In Controller die
