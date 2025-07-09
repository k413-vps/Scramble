export interface Game {
    players: Array<Player>
    board: Array<Array<Tile>>
    multipliers: Array<Array<Multiplier>>
    currentPlayerId: string
    bag: Tile[]
    turnHistory: Turn[]
    timePerTurn: number // epoch time
    timeOfLastTurn: number // epoch time
    dictionary: Dictionary
    wildMode: boolean // are tiles permanently boosted?
    points: LetterPoints
}

export interface Player {
    id: string
    name: string
    hand: Array<Tile>
    points: number
    coins: number
}

export interface Tile {
    letter: string
    points: number
    position: null | Position // null if in hand, position if played
}

export interface Turn {
    playerId: string
    tiles: Array<Tile>
    points: number
}

export interface Position {
    row: number
    col: number
}

export type PlayerAction = 
  | { type: 'place'; tiles: Tile[] }
  | { type: 'pass' }
  | { type: 'exchange'; tiles: Tile[] }


export type Dictionary = {
  [word: string]: true
}

export enum Multiplier {
  DoubleLetter = "2L",
  TripleLetter = "3L",
  DoubleWord = "2W",
  TripleWord = "3W",
  None = "",
  Start = "*"
}

export type LetterPoints = {
    [character: string]: number
}
