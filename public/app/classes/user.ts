export class User {
  constructor(
    public _id: number,
    public username: string,
    public email: string,
    public totalVictories: number,
    public totalScore: number,
    public token: string,
    public password?: string,
    public passwordConfirmation?: string, 
    public playingStatus?: string, 
   // public avatar?: string 
  ) {  }
}
