import express from "express";
import userHandlers from "../../controllers/index"

const router = express.Router();

router.get("/", userHandlers.userControllers.userQueryControllers);

router.put("/update/:id", userHandlers.userControllers.userMutationControllers);

export { router as userRouter };