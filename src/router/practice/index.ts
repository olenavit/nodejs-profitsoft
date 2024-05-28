import express from "express";
import {getPractice, createPractice, practicesCount} from "src/controller/practice";
import constants from "src/commons/constants";

const router = express.Router();

router.post(constants.PATH.BLANK,createPractice);
router.get(constants.PATH.BLANK,getPractice);
router.post(constants.PATH.COUNTS,practicesCount);

export default router;
