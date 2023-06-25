import mongoose from "mongoose";

const TodosSchema = new mongoose.Schema({
  text: { type: String, required: true },
  state: { type: Boolean },
  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});


export const TodosModel = mongoose.model('todos', TodosSchema)