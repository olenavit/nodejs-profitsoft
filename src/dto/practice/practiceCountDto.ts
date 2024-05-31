import {IsArray, IsNotEmpty} from "class-validator";
import Constants from "src/commons/constants";

export class PracticeCountDto {
  @IsNotEmpty({message: Constants.MESSAGES.PRACTICE.PLAYER_IDS_NULL})
  @IsArray({message: Constants.MESSAGES.PRACTICE.PLAYER_IDS_NOT_VALID})
    playerIds?: string[];
}