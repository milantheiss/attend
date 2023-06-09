const Joi = require('joi');

const getDatasetForNewInvoice = {
    query: Joi.object().keys({
        startdate: Joi.string().max(10).truncate().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/).required(),
        enddate: Joi.string().max(10).truncate().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/).required(),
        groups: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).required()
    })
}

const submitInvoice = {
    body: Joi.object().keys({
        department: Joi.object().keys({
            name: Joi.string().required(),
            _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }).required(),
        startdate: Joi.string().max(10).truncate().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/).required(),
        enddate: Joi.string().max(10).truncate().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/).required(),
        groups: Joi.array().items(Joi.object().keys({
            department: Joi.object().keys({
                name: Joi.string().required(),
                _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
            }).required(),
            name: Joi.string().required(),
            times: Joi.array().items(Joi.object().keys({
                day: Joi.string().valid("Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag").required(),
                starttime: Joi.string().regex(/^[0-9]{2}:[0-9]{2}$/).required(),
                endtime: Joi.string().regex(/^[0-9]{2}:[0-9]{2}$/).required(),
                _id: Joi.string().strip()
            })).required(),
            trainers: Joi.array().items(Joi.object().keys({
                userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
                firstname: Joi.string().required(),
                lastname: Joi.string().required(),
                role: Joi.string().valid("trainer", "assistant").required(),
                _id: Joi.string().optional()
            })).required(),
            trainingssessions: Joi.array().items(Joi.object().keys({
                date: Joi.string().max(10).truncate().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/).required(),
                starttime: Joi.string().regex(/^[0-9]{2}:[0-9]{2}$/).required(),
                endtime: Joi.string().regex(/^[0-9]{2}:[0-9]{2}$/).required(),
                participantCount: Joi.number().required(),
                _id: Joi.string().strip(),
            })).required(),
            venue: Joi.string().required(),
            _id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        })).required(),
        submittedBy: Joi.object().keys({
            userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            firstname: Joi.string().required(),
            lastname: Joi.string().required(),
            headerData: Joi.object().keys({
                trainerId: Joi.string().required(),
                isTrainer: Joi.boolean().required(),
                hasLicense: Joi.boolean().required(),
                specialAgreement: Joi.boolean().required(),
                hasContract: Joi.boolean().required(),
                hasAgreedToCodeForChildrenWelfare: Joi.boolean().required(),
                hasSubmittedCriminalRecordCertificate: Joi.boolean().required(),
                _id: Joi.string().strip()
            }).required(),
        }).required()
    })
}

const getAllInYear = {
    params: Joi.object().keys({
        year: Joi.number().required()
    })
}

const approveInvoice = {
    params: Joi.object().keys({
        id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    })
}

const rejectInvoice = {
    params: Joi.object().keys({
        id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    })
}

const reopenInvoice = {
    params: Joi.object().keys({
        id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    })
}

const getInvoiceByID = {
    params: Joi.object().keys({
        id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    })
}

module.exports = {
    getDatasetForNewInvoice,
    submitInvoice,
    getAllInYear,
    approveInvoice,
    rejectInvoice,
    reopenInvoice,
    getInvoiceByID
};