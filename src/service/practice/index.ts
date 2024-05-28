import {PracticeSaveDto} from "src/dto/practice/practiceSaveDto";
import Practice, {IPractice} from "src/model/practice";
import {PracticeDto} from "src/dto/practice/practiceDto";
import {PracticeQueryDto} from "src/dto/practice/practiceQueryDto";
import axios from "axios";
import {HttpError} from "src/system/httpError";
import {BAD_REQUEST, NOT_FOUND} from "http-status";
import constants from "src/commons/constants";
import config from "src/config";
import {InternalError} from "src/system/internalError";

export const createPractice = async (practiceDto: PracticeSaveDto): Promise<string> => {
  console.log('practiceDto',practiceDto)
  await validatePlayerId(practiceDto.playerId);
  await validatePractice(practiceDto);
  const practice = await new Practice(practiceDto).save();
  return practice._id;
};

export const getPractice = async (query: PracticeQueryDto): Promise<PracticeDto[]> => {
  const {
    playerId
  } = query;

  if (!playerId) {
    throw new HttpError(constants.MESSAGES.PRACTICE.PLAYER_ID_NULL, BAD_REQUEST);
  }

  const practices = await Practice
    .find({"playerId": playerId})
    .skip(query.from)
    .limit(query.size);

  return practices.map(practice => toDto(practice)).sort((practice1, practice2) => practice1.date.getDate() - practice2.date.getDate());
};


const toDto = (practice: IPractice): PracticeDto => {
  return ({
    _id: practice._id,
    name: practice.name,
    playerId: practice.playerId,
    date: practice.date,
  });
};


export const practicesCount = async (playerIds:string[]): Promise<string> => {
  const counts = await Practice.aggregate([{
    $match: {
      playerId: {$in: playerIds.map(id => parseInt(id))},
    }
  },
    {$group: {_id: '$playerId', count: {$sum: 1}}},
    {$sort: {"count": -1}}
  ]);
  return JSON.stringify(counts);
};


const validatePractice = async (practiceDto: PracticeSaveDto) => {

  if (!practiceDto.playerId) {
    throw new HttpError(constants.MESSAGES.PRACTICE.PLAYER_ID_NULL, BAD_REQUEST);
  }

  if (!practiceDto.name) {
    throw new HttpError(constants.MESSAGES.PRACTICE.NAME_NULL, BAD_REQUEST);
  }

  if (!practiceDto.date) {
    throw new HttpError(constants.MESSAGES.PRACTICE.DATE_NOT_VALID, BAD_REQUEST);
  }

  const date = new Date(practiceDto.date);
  if(isNaN(date.getTime())){
    throw  new HttpError(constants.MESSAGES.PRACTICE.DATE_NOT_VALID, BAD_REQUEST);
  }

  if (practiceDto.date.getTime() < new Date().getTime()) {
    throw new HttpError(constants.MESSAGES.PRACTICE.DATE_NOT_IN_FUTURE, BAD_REQUEST);
  }
};


export const validatePlayerId = async (playerId: number | undefined) => {
  const url = `${config.playerResource.url}/${playerId}`;
  await axios.get(url).catch(err => {
      if (err.response.status == NOT_FOUND || err.response.status == BAD_REQUEST) {
        throw new HttpError(`${constants.MESSAGES.PRACTICE.PLAYER_ID_NOT_VALID} ${playerId}`, BAD_REQUEST);
      } else {
        throw new InternalError(err);
      }
    }
  );
}