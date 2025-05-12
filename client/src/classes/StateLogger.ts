import Game from "./Game";

interface LoggedState{
    [key: string]: any
}

export default class StateLogger{
    private _stateLog: LoggedState;
    get stateLog(){
        return this._stateLog;
    }
    set stateLog(value){
        this._stateLog = value;
    }

    private _games: Game[];
    get games(){
        return this._games;
    }
    set games(value){
        this._games = value;
    }

    constructor(games: Game[]){
        this._games = games;
        this._stateLog = this.logCurrentState()
    }

    private logCurrentState(): LoggedState{
        let loggedState: LoggedState = {};
        for (let i = 0; i < this._games.length; i++){
            const gameName = this._games[i].name;
            loggedState[gameName] = "abc"
        }
        return loggedState;
    }
}