import express from 'express'
import mongoose from 'mongoose'
import { TodosModel } from '../models/Todos.js'
import { UserModel } from '../models/user.js'
import { userRouter } from './users.js'

const router =express.Router()



router.get("/", async (req, res) => {
  const userId = req.query.userId;
  try {
    const response = await TodosModel.find({ userOwner: userId }); 
    res.json(response);
  } catch (error) {
    res.json(error);
  }
});

router.post('/',async(req,res)=>{
    const todo = new TodosModel(req.body)
    try {
        const response = await todo.save()
        res.json(response)
    } catch (error) {
        return res
          .status(409)
          .send({ message: "Todo is already exists!" });
    }
})
router.put('/',async(req,res)=>{
    try {
        const todo = await TodosModel.findById(req.body.todoId)
        const user = await UserModel.findById(req.body.userId);
        todo.state = "true"
        console.log(todo);
        user.done.push(todo)
        await user.save()

        res.json({done: user.done})
    } catch (error) {
        return res
          .status(409)
          .send({ message: "Empty Completed list" });
    }
})
router.put("/done/:userId/:todoId", async (req, res) => {
  try {
    const { userId, todoId } = req.params;
    const user = await UserModel.findById(userId);

    if (!user || !user.done.includes(todoId)) {
      return res.status(404).json({ message: "Todo not found" });
    }
    user.done = user.done.filter((id) => id !== todoId);
    todo.state = true;
    await user.save();

    res.status(200).json({ message: "Todo marked as not done" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/done',async(req,res)=>{
    try {
        const todo = await TodosModel.findById(req.body.todoId)
        const user = await UserModel.findById(req.body.userId);
        console.log(req.body);
    
        res.json({done: user.done})
    } catch (error) {
        return res
          .status(409)
          .send({ message: "Empty Completed list" });
    }
})


// Get id of saved Todos
router.get("/done/ids/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    res.status(201).json({ done: user?.done });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Get saved Todos
router.get("/done/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId).populate("done");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ done: user.done });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.delete("/done/:userId/:objectId", async (req, res) => {
  try {
    const { userId, objectId } = req.params;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const objectIndex = user.done.findIndex(
      (obj) => obj.toString() === objectId
    );

    if (objectIndex === -1) {
      return res
        .status(404)
        .json({ message: "Object not found in done array" });
    }

    user.done.splice(objectIndex, 1);
    await user.save();

    res.status(200).json({ message: "Object removed from done array" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

/////////DELETE
router.delete("/:id", async (req, res) => {
  const todoId = req.params.id;

  try {
    await TodosModel.findByIdAndDelete(todoId);

    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting todo" });
  }
});

router.delete("/done/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
   
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.done = [];

  
    await user.save();

    res.status(200).json({ message: "All done content deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});










export {router as todosRouter}