import {QueryDto} from "src/dto/queryDto";

export class PracticeQueryDto extends QueryDto {
  playerId?: string;

  constructor(data:Partial<PracticeQueryDto>) {
    super();
    this.playerId = data.playerId;
    this.from=data.from||0;
    this.size=data.size||10;
  }

}