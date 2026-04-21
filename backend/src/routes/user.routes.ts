import express from "express";
import { createUser, getUsers, updateUser, deleteUser } from "../controllers/user.controller";
import { protect, adminOnly } from "../middleware/auth.middleware";

const router = express.Router();

// All routes are protected and admin only
router.use(protect);
router.use(adminOnly);

router.route("/")
    .get(getUsers)
    .post(createUser);

router.route("/:id")
    .put(updateUser)
    .delete(deleteUser);

export default router;
