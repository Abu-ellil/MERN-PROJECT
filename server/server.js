import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();


// Import your routers
import { userRouter } from "./routes/users.js";
import { todosRouter } from "./routes/todos.js";

// Database connection & port
const URL = process.env.URL;
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
// Mount your routers as middleware
app.use("/auth", userRouter);
app.use("/todos", todosRouter);

// Root route
app.get("/", (req, res) => {
  res.json({ hello: "مرحبا بكم" });
});

app.listen(port, () => {
  console.log(`LIVE ON ${port}...`);
});
