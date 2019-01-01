const { returnError } = require('../logic/logic');

const fileExistsInReq = (req, res, next) => {
    if (!req.files) return returnError(res, 400, "there was no file sent");
    else next();
}

const isValidExtension = (req, res, next) => {
    let file = req.files.file;
    let validExtensions = ['image/jpg', 'image/png', 'image/jpeg', 'image/gif']

    if (!validExtensions.includes((file.mimetype))) return returnError(res, 400, "Extension type not valid. The allowed extensions are: " + validExtensions.join(', '));

    next();
}

module.exports = {
    fileExistsInReq,
    isValidExtension
}