import log4js from 'log4js';
import {Request, Response} from 'express';
import {
  createPractice as createPracticeApi,
  getPractice as getPracticeApi,
  practicesCount as practicesCountApi,
} from 'src/service/practice';
import {AppError} from 'src/system/appError';
import {PracticeCreateDto} from "src/dto/practice/practiceCreateDto";
import {OK, NOT_FOUND, CREATED} from "http-status";
import {PracticeQueryDto} from "src/dto/practice/practiceQueryDto";
import Constants from "src/commons/constants";

export const getPractice = async (req: Request, res: Response) => {
  const query = new PracticeQueryDto(req.query);
  try {
    const practice = await getPracticeApi(query);
    if (practice.length === 0) {
      res.status(NOT_FOUND).send({message: Constants.MESSAGES.PRACTICE.PLAYER_ID_NOT_FOUND + query.playerId});
    } else {
      res.status(OK).send(practice);
    }
  } catch (err) {
    const {message, status} = new AppError(err);
    log4js.getLogger().error(`Error in retrieving practice.`, err);
    res.status(status).send({message});
  }
};

export const createPractice = async (req: Request, res: Response) => {
  try {
    const practiceSaveDto: PracticeCreateDto = req.body;
    const id = await createPracticeApi(practiceSaveDto);
    res.status(CREATED).send(id);
  } catch (err) {
    const {message, status} = new AppError(err);
    log4js.getLogger().error('Error in creating practice.', err);
    res.status(status).send({message});
  }
};


export const practicesCount = async (req: Request, res: Response) => {
  try {
    const {playerIds} = req.body;
    const practicesCounts = await practicesCountApi(playerIds);
    res.status(OK).send(JSON.parse(practicesCounts));
  } catch (err) {
    const {message, status} = new AppError(err);
    log4js.getLogger().error('Error in retrieving practices counts.', err);
    res.status(status).send({message});
  }
};
