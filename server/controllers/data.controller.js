const {dataService} = require('../services')
const catchAsync = require('../utils/catchAsync');

const getLastPatchNotes = catchAsync(async (req, res) => {
    //INFO Everybody can access last patchnotes
    res.send(await dataService.getLastPatchNotes())
});

const addNewPatchNote = catchAsync(async (req, res) => {
    res.send(await dataService.addNewPatchNote(req.user, req.body))
})

const markPatchnotesAsRead = catchAsync(async (req, res) => {
    res.send(await dataService.markPatchnotesAsRead(req.user))
})

module.exports = {
    getLastPatchNotes,
    addNewPatchNote,
    markPatchnotesAsRead
}