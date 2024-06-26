import {PracticeCreateDto} from "src/dto/practice/practiceCreateDto";
import Practice, {IPractice} from "src/model/practice";
import {PracticeDto} from "src/dto/practice/practiceDto";
import {PracticeQueryDto} from "src/dto/practice/practiceQueryDto";
import axios from "axios";
import {HttpError} from "src/system/httpError";
import {BAD_REQUEST, NOT_FOUND} from "http-status";
import constants from "src/commons/constants";
import config from "src/config";
import {AppError} from "../../system/appError";

export const createPractice = async (practiceDto: PracticeCreateDto): Promise<string> => {
  await validatePlayerId(practiceDto.playerId);
  const practice = await new Practice(practiceDto).save();
  return practice._id;
};

export const getPractice = async (query: PracticeQueryDto): Promise<PracticeDto[]> => {
  const {
    playerId,
  } = query;
  const practices = await Practice
    .find({"playerId": playerId})
    .skip(parseInt(query.from))
    .limit(parseInt(query.size));

  return practices.map(practice => toDto(practice)).sort((practice1, practice2) => practice1.date.getTime() - practice2.date.getTime());
};


const toDto = (practice: IPractice): PracticeDto => {
  return ({
    _id: practice._id,
    name: practice.name,
    playerId: practice.playerId,
    date: practice.date,
  });
};


export const practicesCount = async (playerIds: string[]): Promise<string> => {
  const counts = await Practice.aggregate([{
    $match: {
      playerId: {$in: playerIds.map(id => parseInt(id))},
    },
  },
  {$group: {_id: '$playerId', count: {$sum: 1}}},
  {$sort: {"count": -1}},
  ]);
  return JSON.stringify(counts);
};


export const validatePlayerId = async (playerId: number | undefined) => {
  const url = `${config.playerResource.url}/${playerId}`;
  await axios.get(url).catch(err => {
    if (err.response?.status == NOT_FOUND || err.response?.status == BAD_REQUEST) {
      throw new HttpError(`${constants.MESSAGES.PRACTICE.PLAYER_ID_NOT_FOUND} ${playerId}`, BAD_REQUEST);
    } else {
      throw new AppError(err);
    }
  }
  );
};