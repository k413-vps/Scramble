import { generateSeed } from "shared/functions/util";
import { CreateGameRequest } from "shared/types/API";
import { BoardEnums, CreateGameFormValues, LengthEnums } from "./formType";
import { Enhancement } from "shared/types/game";
import { scrabbleEnhancements, letterLeagueEnhancements } from "shared/defaults/Enhancements";
import { defaultPoints } from "shared/defaults/LetterPoints";
import {
    letterLeagueShortFrequency,
    letterLeagueMediumFrequency,
    letterLeagueLongFrequency,
} from "shared/defaults/LetterFrequencies";

import { LetterCount } from "shared/types/misc";

export function formToRequest(form: CreateGameFormValues): CreateGameRequest {
    const timePerTurn = form.timePerTurn ? form.timePerTurn : 0;
    const enhancements = getEnhancements(form.board);
    const frequencies = getFrequencies(form.length);

    console.log(frequencies);

    const ans: CreateGameRequest = {
        enhancements: enhancements,
        letterFrequency: frequencies,
        timePerTurn: timePerTurn,
        wildMode: form.wildMode,
        points: defaultPoints,
        enableEnchantments: form.enableEnchantments,
        enableSpecialActions: form.enableSpecialActions,
        public: form.public,
        handSize: form.handSize,
        seed: form.seed,
        dictionary: form.dictionary,
    };

    return ans;
}

function getEnhancements(board: BoardEnums): Enhancement[][] {
    if (board == "letter league") {
        return letterLeagueEnhancements;
    } else if (board == "scrabble") {
        return scrabbleEnhancements;
    }

    return [];
}

function getFrequencies(length: LengthEnums): LetterCount {
    if (length === "short") {
        return letterLeagueShortFrequency;
    } else if (length === "medium") {
        return letterLeagueMediumFrequency;
    } else if (length === "long") {
        return letterLeagueLongFrequency;
    }

    return letterLeagueMediumFrequency;
}
