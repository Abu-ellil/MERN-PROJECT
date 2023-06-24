import express from "express"
import cors from 'cors'
import mongoose from 'mongoose'
const app = express()

import { userRouter } from "./routes/users.js"
import { todosRouter } from "./routes/todos.js"

////DATABASE & PORT
mongoose.connect('mongodb+srv://mrabuellil:mrabuellil@mern-todo.ff0xnlu.mongodb.net/mern-todo?retryWrites=true&w=majority',{useNewUrlParser:true,useUnifiedTopology:true})
const port = process.env.PORT || 8080
////MIDDLERS
app.use(express.json())
app.use(cors())
////
app.use('/auth',userRouter)
app.use('/todos',todosRouter)
////
app.get('/',(req,res)=>{
    res.json({'helooooo':"sdfsdfsdf"})
})
////////                    ///////
///////                    ///////
app.listen(port ,()=>{console.log(`LIVE ON ${port}...`);})