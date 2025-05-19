import express from "express";
import userHandlers from "../../controllers/index"

const router = express.Router();

router.get("/", userHandlers.userControllers.userQueryControllers.getUsers);

router.put("/update/:id", userHandlers.userControllers.userMutationControllers.updateUser);

export { router as userRouter };