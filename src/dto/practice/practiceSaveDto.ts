export class PracticeSaveDto {
  name?: string;
  date?: Date;
  playerId?: number;

  constructor(data: Partial<PracticeSaveDto>) {
    this.name = data.name;
    this.date = data.date;
    this.playerId = data.playerId;
  }
}