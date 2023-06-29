import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.js";

const router = express.Router();


///register
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      return res
        .status(409)
        .send({ message: "User with this email already exists!" });
    }
    const cryptPass = await bcrypt.hash(password, 10); // Hashing the password
    const newUser = new UserModel({
      email,
      password: cryptPass,
      isRegistrationComplete: false,
    });
    await newUser.save();
console.log(newUser);
    const userId = newUser._id;

    res.status(201).send({
      userId: userId,
      message:
        "User registered successfully. Please provide additional information.",
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

//SECOND STEP

router.post("/register/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, phone, birthYear } = req.body;
    console.log(req.params);
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username;
    user.phone = phone;
    user.birthYear = birthYear;

    await user.save();

    res.status(200).json({ message: "User information updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log(error);
  }
});
//////login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(409).send({ message: "User Doesn't Exist!" });
    }
    const isPassValid = await bcrypt.compare(password, user.password);
    if (!isPassValid) {
      return res
        .status(409)
        .send({ message: "Username Or Password Is Incorrect!" });
    }
    const token = jwt.sign({ id: user._id }, "secret");
    res.json({ token, userId: user._id ,user});
  } catch (error) {}
});



///get user data
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
////update data
router.patch("/register/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const {email,password, username, phone, birthYear } = req.body;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.email = email;
    user.password = password;
    user.username = username;
    user.phone = phone;
    user.birthYear = birthYear;

    await user.save();

    res.status(200).json({ message: "User information updated successfully",user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log(error);
  }
});



export { router as userRouter };
 