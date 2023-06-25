import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    email:{type:String, required:true},
    password:{type:String, required:true},
    username:{type:String},
    phone:{type:Number},
    birthYear:{type:Number},
    done:[{type:mongoose.Schema.Types.ObjectId, ref:'todos',unique:true}]
})


export const UserModel = mongoose.model('users', userSchema)