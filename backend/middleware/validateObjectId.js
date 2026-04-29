const mongoose = require("mongoose");

const validateObjectByID = (req, res, next) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({message: "Invalid Id Format"});
    }
    next();
};
module.exports = validateObjectByID;