export interface CalculateScoreReturn {
    points: number;
    mana: number;
    wordsFormed: string[];
    idToPoints: Record<string, number>;
}
