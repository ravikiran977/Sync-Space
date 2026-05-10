const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Task = require("../models/Task");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Create a new task - POST /api/tasks from admin login

router.post("/", authMiddleware, authorizeRoles("admin"), async (req, res) => {
    try{
        const task = new Task({
            ...req.body,
            createdBy: req.user.id
        });
        await task.save();

        const populatedTask = await Task.findById(task._id)
        .populate("assignedTo", "name email")
        .populate("createdBy","name email");
        res.status(201).json(populatedTask);
    }
    catch(error) 
    {
        res.status(500).json({ error: error.message });
    }
});

// Get all tasks - GET /api/tasks from admin login


router.get("/", authMiddleware, authorizeRoles("admin"), async (req, res) => {
    try {

        const filter = {};
        //filter tasks by status

        if (req.query.status) {
            filter.status = req.query.status;
        }

        // Filter by assigned user
        if(req.query.assignedTo) {
            filter.assignedTo = req.query.assignedTo;
        }
        const task = await Task.find(filter)
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email");
        res.status(200).json(task);
    } 
    catch(error) {
        res.status(500).json({error:error.message});
    }
});

// Get assigned tasks - GET /api/tasks/  --assigned from user login

router.get("/my",authMiddleware, async(req, res) => {
    try {
        const task =await Task.find({ assignedTo: req.user.id});
        res.status(200).json(task);
    }
    catch(error) {
        res.status(500).json({error:error.message});
    }
});



//admin dashboard - GET /api/tasks/dashboard from admin login

router.get("/dashboard", authMiddleware, authorizeRoles("admin"), async(req,res) =>{
    try{
        const stats = await Task.aggregate([
            {
                $group: {
                    _id : "$status",
                    count: { $sum: 1 }
                }
            }
        ]);
        const result ={
            totalTasks: 0,
            completed: 0,
            inProgress: 0,
            review: 0,
            todo:0
        };

        stats.forEach(item => {
            result.totalTasks += item.count;

            if (item._id === "todo") result.todo = item.count;
            else if (item._id === "in-progress") result.inProgress = item.count;
            else if (item._id === "review") result.review = item.count;
            else if (item._id === "completed") result.completed = item.count;
            
        });
        res.status(200).json(result);
    } catch(error) {
        res.status(500).json({error:error.message});
    }
});

// ==============================
// USER TASK STATISTICS
// GET /api/tasks/my-stats
// ==============================

router.get("/my-dashboard", authMiddleware, async (req, res) => {
  try {

    const stats = await Task.aggregate([
      {
        $match: { assignedTo: new mongoose.Types.ObjectId(req.user.id) }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      totalTasks: 0,
      todo: 0,
      inProgress: 0,
      review: 0,
      completed: 0
    };

    stats.forEach(item => {
      result.totalTasks += item.count;

      if (item._id === "todo") result.todo = item.count;
      if (item._id === "in-progress") result.inProgress = item.count;
      if (item._id === "review") result.review = item.count;
      if (item._id === "completed") result.completed = item.count;
    });

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get task details - GET/api.tasks/:id from  both user/admin login for view task page

router.get("/:id", authMiddleware, async (req,res) => {
    try{
        const task = await Task.findById(req.params.id)
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email");

        if(!task){
            return res.status(404).json({
                message: "Task Not Found"
            });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message }); 
    }
});

// Update status of task by user - PUT /api/tasks/:id from user login

router.put("/:id", authMiddleware, async (req, res) =>{
    try{
        const task = await Task.findById(req.params.id);
        if(!task) {
            return res.status(404).json({message:"Task not found"});
        }
        
        // check if the task is assigned to the user

        if (!task.assignedTo ||
         (task.assignedTo.toString() !== req.user.id && req.user.role !== "admin")) {
            return res.status(403).json({ message: "Unauthorized access" });
        }
        console.log("USER", req.user);

        // update task status
        const allowedStatus = Task.schema.path("status").enumValues; // Get allowed status values from the schema
        task.status = req.body.status;
        await task.save();
        res.status(200).json({message: "Task status updated successfully", task});
        
    }catch(error) {
        res.status(500).json({error:error.message});
    }
});


// delete task by admin - DELETE /api/tasks/:id from admin login

router.delete("/:id", authMiddleware, authorizeRoles("admin"), async(req, res) =>{
    try{
        const task= await Task.findByIdAndDelete(req.params.id);

        if(!task) {
            return res.status(404).json({message: "Task Not found"});
        }
         res.status(200).json({message: "Task deleted Successfully"});
    }catch(error) {
        res.status(500).json({error:error.message});
    }
});

module.exports = router;