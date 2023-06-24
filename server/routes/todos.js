import express from 'express'
import mongoose from 'mongoose'
import { TodosModel } from '../models/Todos.js'
import { UserModel } from '../models/user.js'
import { userRouter } from './users.js'

const router =express.Router()

router.get('/',async(req,res)=>{
    try {
        const response = await TodosModel.find({})
        res.json(response)
    } catch (error) {
        res.json(error)
    }
})
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
        const user = await UserModel.findById(req.body.todoId);
        user.done.push(todo)
        await user.save()

        res.json({done: user.done})
    } catch (error) {
        return res
          .status(409)
          .send({ message: "Empty Completed list" });
    }
})

router.get('/completed/ids',async(req,res)=>{
    try {
        const user = await userRouter.findById(req.body.userId)
        res.json({done:user?.done})
    } catch (error) {
        return res.status(409).send({ message: "Empty Something list" });
    }
})


router.get('/completed',async(req,res)=>{
    try {
        const user = await userRouter.findById(req.body.userId)
        const done =await TodosModel.find({
            _id: {$in: user.done}
        })
        res.json({done})
    } catch (error) {
        return res.status(409).send({ message: "Empty Something list" });
    }
})


export {router as todosRouter}