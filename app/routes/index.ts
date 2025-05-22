import express from 'express';
// import { authRouter } from './auth';
// import { rolesRouter } from './roles';
// import { userRouter } from './user';
import { productsRouter } from './products';
import { categoryRouter } from './categories';
import { reviewRouter } from './reviews';
import { articleRouter } from './articles';
import { storeRouter } from './store';
import { contactRouter } from './contact';

const router = express.Router();

const test_api = '/api/v1'

// Use routes
// router.use(`${test_api}/auth`, authRouter);
// router.use(`${test_api}/roles`, rolesRouter);
// router.use(`${test_api}/users`, userRouter);
router.use(`${test_api}/product`, productsRouter);
router.use(`${test_api}/category`, categoryRouter);
router.use(`${test_api}/review`, reviewRouter);
router.use(`${test_api}/article`, articleRouter);
router.use(`${test_api}/store`, storeRouter);
router.use(`${test_api}/contact`, contactRouter);

export default router;