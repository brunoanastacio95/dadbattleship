export class Game {
  constructor(
    public _id: number,
    public ownerId: string,
    public startDate: string,
    public endDate : string,
    public winnerId: string,
    public finish: boolean,
    public players: [{}],
    public gameStatus: string
  ) {  }
}
