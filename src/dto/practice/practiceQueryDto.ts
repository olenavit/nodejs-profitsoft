import {QueryParamsDto} from "src/dto/queryParamsDto";
import {IsNotEmpty, IsNumberString} from "class-validator";
import Constants from "src/commons/constants";

export class PracticeQueryDto extends QueryParamsDto {
  @IsNumberString()
  @IsNotEmpty({message: Constants.MESSAGES.PRACTICE.PLAYER_ID_NULL})
    playerId?: string;

  constructor(data: Partial<PracticeQueryDto>) {
    super();
    this.playerId = data?.playerId;
    this.from = data?.from || "0";
    this.size = data?.size || "10";
  }

}