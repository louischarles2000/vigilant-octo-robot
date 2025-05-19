import express from "express" ;
import authHandlers from "../../controllers/auth";

const router = express.Router();


router.post("/create", authHandlers.authMutationController.createNewUser);
router.post("/login", authHandlers.authMutationController.handleLogin);

export { router as authRouter };