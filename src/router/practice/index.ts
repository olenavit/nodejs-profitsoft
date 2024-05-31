import express from "express";
import {getPractice, createPractice, practicesCount} from "src/controller/practice";
import constants from "src/commons/constants";
import {
  createPracticeValidationMiddleware, practiceCountValidationMiddleware,
  practiceQueryValidationMiddleware,
} from "src/middelvare/validation/practiceValidationMiddleware";

const router = express.Router();

router.post(constants.PATH.BLANK, createPracticeValidationMiddleware(), createPractice);
router.get(constants.PATH.BLANK, practiceQueryValidationMiddleware(), getPractice);
router.post(constants.PATH.COUNTS, practiceCountValidationMiddleware(), practicesCount);

export default router;
