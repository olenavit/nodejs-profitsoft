import express from 'express';
import practice from './practice';
import constants from "src/commons/constants";

const router = express.Router();

router.use(constants.PATH.PRACTICE, practice);
export default router;
