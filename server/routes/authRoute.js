import express from "express";
import {
  changePasswordController,
  deleteUser,
  forgotPasswordController,
  // getAllUserController,
  getUsers,
  loginController,
  registerController,
  singleUserController,
  testController,
  // updateProfileController,
  updateUserController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/signup", registerController);

//LOGIN || POST
router.post("/signin", loginController);

//get users
router.get("/users", getUsers);

//get single user
router.get("/user/:id", singleUserController);

//delete user
router.delete("/delete-user/:id", deleteUser);

//update
router.put("/update-user/:id", updateUserController);

//changePassword
router.post("/changePassword/:id", changePasswordController);

//all user
// router.get("/getAll", requireSignIn, isAdmin, getAllUserController);

// Forgot password || POST
router.post("/forgot-password", forgotPasswordController);

//Forgot password || POST
// router.get("/reset-password/:id/:token", resetPasswordController);

//test routes
router.get("/test", requireSignIn, isAdmin, testController);

//protected route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

export default router;
