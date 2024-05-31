import {IsDateString, IsNotEmpty, IsNumber, IsString, MinLength} from "class-validator";
import {Trim} from "class-sanitizer";
import Constants from "src/commons/constants";
import {FutureDate} from "src/annotation/futureDate";

export class PracticeCreateDto {
  @IsString()
  @Trim()
  @MinLength(3, {message: Constants.MESSAGES.PRACTICE.NAME_NOT_VALID})
  @IsNotEmpty({message: Constants.MESSAGES.PRACTICE.NAME_NULL})
    name?: string;

  @IsDateString({}, {message: Constants.MESSAGES.PRACTICE.DATE_NOT_VALID})
  @IsNotEmpty({message: Constants.MESSAGES.PRACTICE.DATE_NULL})
  @FutureDate({message: Constants.MESSAGES.PRACTICE.DATE_IN_FUTURE})
  @IsNotEmpty({message: Constants.MESSAGES.PRACTICE.DATE_NULL})
    date?: Date;
  @IsNumber({}, {message: Constants.MESSAGES.PRACTICE.PLAYER_ID_NOT_VALID})
  @IsNotEmpty({message: Constants.MESSAGES.PRACTICE.PLAYER_ID_NULL})
    playerId?: number;
}