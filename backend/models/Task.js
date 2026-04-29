const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
    title: {
        type: String,
        required:true
    },
    description: {
        type: String,
        required:true
    },
    status: {
        type: String,
        enum: ["todo", "in-progress","review", "completed"],
        default: "todo"
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    dueDate : {
        type: Date,
        required: true
    },
    priority:{
        type: String,
        enum: ["low", "medium", "high"]
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Task",taskSchema);