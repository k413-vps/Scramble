import { Enhancement } from "../types/game";

export const scrabbleEnhancements: Enhancement[][] = [
    ["3W", "  ", "  ", "2L", "  ", "  ", "  ", "3W", "  ", "  ", "  ", "2L", "  ", "  ", "3W"],
    ["  ", "2W", "  ", "  ", "  ", "3L", "  ", "  ", "  ", "3L", "  ", "  ", "  ", "2W", "  "],
    ["  ", "  ", "2W", "  ", "  ", "  ", "2L", "  ", "2L", "  ", "  ", "  ", "2W", "  ", "  "],
    ["2L", "  ", "  ", "2W", "  ", "  ", "  ", "2L", "  ", "  ", "  ", "2W", "  ", "  ", "2L"],
    ["  ", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "  "],
    ["  ", "3L", "  ", "  ", "  ", "3L", "  ", "  ", "  ", "3L", "  ", "  ", "  ", "3L", "  "],
    ["  ", "  ", "2L", "  ", "  ", "  ", "2L", "  ", "2L", "  ", "  ", "  ", "2L", "  ", "  "],
    ["3W", "  ", "  ", "2L", "  ", "  ", "  ", "2*", "  ", "  ", "  ", "2L", "  ", "  ", "3W"],
    ["  ", "  ", "2L", "  ", "  ", "  ", "2L", "  ", "2L", "  ", "  ", "  ", "2L", "  ", "  "],
    ["  ", "3L", "  ", "  ", "  ", "3L", "  ", "  ", "  ", "3L", "  ", "  ", "  ", "3L", "  "],
    ["  ", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "  "],
    ["2L", "  ", "  ", "2W", "  ", "  ", "  ", "2L", "  ", "  ", "  ", "2W", "  ", "  ", "2L"],
    ["  ", "  ", "2W", "  ", "  ", "  ", "2L", "  ", "2L", "  ", "  ", "  ", "2W", "  ", "  "],
    ["  ", "2W", "  ", "  ", "  ", "3L", "  ", "  ", "  ", "3L", "  ", "  ", "  ", "2W", "  "],
    ["3W", "  ", "  ", "2L", "  ", "  ", "  ", "3W", "  ", "  ", "  ", "2L", "  ", "  ", "3W"],
].map((row) =>
    row.map((cell) => cell as Enhancement)
);


const letterLeagueEnhancementsBase: Enhancement[][] = [
    ["  ", "  ", "  ", "2L", "  ", "  ", "2L", "  ", "2L", "  ", "  ", "2L", "  ", "  ", "  ", "2L", "  ", "  ", "2L", "  ", "2L", "  ", "  ", "2L", "  ", "  ", "  "],
    ["  ", "2L", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "2L", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "2L", "  "],
    ["  ", "  ", "  ", "  ", "2L", "  ", "3L", "  ", "3L", "  ", "2L", "  ", "  ", "  ", "  ", "  ", "2L", "  ", "3L", "  ", "3L", "  ", "2L", "  ", "  ", "  ", "  "],
    ["2L", "2W", "2L", "  ", "  ", "  ", "  ", "3W", "  ", "  ", "  ", "  ", "2L", "2W", "2L", "  ", "  ", "  ", "  ", "3W", "  ", "  ", "  ", "  ", "2L", "2W", "2L"],
    ["  ", "  ", "  ", "  ", "2L", "  ", "3L", "  ", "3L", "  ", "2L", "  ", "  ", "  ", "  ", "  ", "2L", "  ", "3L", "  ", "3L", "  ", "2L", "  ", "  ", "  ", "  "],
    ["  ", "2L", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "2L", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "2L", "  "],
    ["  ", "  ", "  ", "2L", "  ", "  ", "2L", "  ", "2L", "  ", "  ", "2L", "  ", "  ", "  ", "2L", "  ", "  ", "2L", "  ", "2L", "  ", "  ", "2L", "  ", "  ", "  "],
    ["3L", "  ", "3L", "  ", "  ", "  ", "  ", "2L", "  ", "  ", "  ", "  ", "3L", "  ", "3L", "  ", "  ", "  ", "  ", "2L", "  ", "  ", "  ", "  ", "3L", "  ", "3L"],
    ["  ", "  ", "  ", "2W", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "2W", "  ", "**", "  ", "2W", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "2W", "  ", "  ", "  "],
    ["3L", "  ", "3L", "  ", "  ", "  ", "  ", "2L", "  ", "  ", "  ", "  ", "3L", "  ", "3L", "  ", "  ", "  ", "  ", "2L", "  ", "  ", "  ", "  ", "3L", "  ", "3L"],
    ["  ", "  ", "  ", "2L", "  ", "  ", "2L", "  ", "2L", "  ", "  ", "2L", "  ", "  ", "  ", "2L", "  ", "  ", "2L", "  ", "2L", "  ", "  ", "2L", "  ", "  ", "  "],
    ["  ", "2L", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "2L", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "2L", "  "],
    ["  ", "  ", "  ", "  ", "2L", "  ", "3L", "  ", "3L", "  ", "2L", "  ", "  ", "  ", "  ", "  ", "2L", "  ", "3L", "  ", "3L", "  ", "2L", "  ", "  ", "  ", "  "],
    ["2L", "2W", "2L", "  ", "  ", "  ", "  ", "3W", "  ", "  ", "  ", "  ", "2L", "2W", "2L", "  ", "  ", "  ", "  ", "3W", "  ", "  ", "  ", "  ", "2L", "2W", "2L"],
    ["  ", "  ", "  ", "  ", "2L", "  ", "3L", "  ", "3L", "  ", "2L", "  ", "  ", "  ", "  ", "  ", "2L", "  ", "3L", "  ", "3L", "  ", "2L", "  ", "  ", "  ", "  "],
    ["  ", "2L", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "2L", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "2L", "  "],
    ["  ", "  ", "  ", "2L", "  ", "  ", "2L", "  ", "2L", "  ", "  ", "2L", "  ", "  ", "  ", "2L", "  ", "  ", "2L", "  ", "2L", "  ", "  ", "2L", "  ", "  ", "  "],
].map((row) =>
    row.map((cell) => cell as Enhancement)
);

const letterLeagueRow1: Enhancement[][] = [
    ["  ", "  ", "  ", "2L", "  ", "  ", "2L", "  ", "2L", "  ", "  ", "2L", "  ", "  ", "  ", "2L", "  ", "  ", "2L", "  ", "2L", "  ", "  ", "2L", "  ", "  ", "  "],
    ["  ", "2L", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "2L", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "2L", "  "],
    ["  ", "  ", "  ", "  ", "2L", "  ", "3L", "  ", "3L", "  ", "2L", "  ", "  ", "  ", "  ", "  ", "2L", "  ", "3L", "  ", "3L", "  ", "2L", "  ", "  ", "  ", "  "],
    ["2L", "2W", "2L", "  ", "  ", "  ", "  ", "3W", "  ", "  ", "  ", "  ", "2L", "2W", "2L", "  ", "  ", "  ", "  ", "3W", "  ", "  ", "  ", "  ", "2L", "2W", "2L"],
    ["  ", "  ", "  ", "  ", "2L", "  ", "3L", "  ", "3L", "  ", "2L", "  ", "  ", "  ", "  ", "  ", "2L", "  ", "3L", "  ", "3L", "  ", "2L", "  ", "  ", "  ", "  "],
    ["  ", "2L", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "2L", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "2L", "  "],
    ["  ", "  ", "  ", "2L", "  ", "  ", "2L", "  ", "2L", "  ", "  ", "2L", "  ", "  ", "  ", "2L", "  ", "  ", "2L", "  ", "2L", "  ", "  ", "2L", "  ", "  ", "  "],
].map((row) =>
    row.map((cell) => cell as Enhancement)
);

const letterLeagueRow2: Enhancement[][] = [ //                                      **
    ["3L", "  ", "3L", "  ", "  ", "  ", "  ", "2L", "  ", "  ", "  ", "  ", "3L", "  ", "3L", "  ", "  ", "  ", "  ", "2L", "  ", "  ", "  ", "  ", "3L", "  ", "3L"],
    ["  ", "  ", "  ", "2W", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "2W", "  ", "  ", "  ", "2W", "  ", "  ", "  "],
    ["3L", "  ", "3L", "  ", "  ", "  ", "  ", "2L", "  ", "  ", "  ", "  ", "3L", "  ", "3L", "  ", "  ", "  ", "  ", "2L", "  ", "  ", "  ", "  ", "3L", "  ", "3L"],

].map((row) =>
    row.map((cell) => cell as Enhancement)
);


const letterLeagueRow0Col0: Enhancement[][] = [
    ["2L", "  ", "  ", "  ", "2L"],
    ["  ", "  ", "2L", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  "],
    ["  ", "2L", "2W", "2L", "  "],
    ["  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "2L", "  ", "  "],
    ["2L", "  ", "  ", "  ", "2L"],
].map((row) =>
    row.map((cell) => cell as Enhancement)
);

const letterLeagueRow0Col1: Enhancement[][] = [
    ["  ", "  ", "2L", "  ", "2L", "  ", "  "],
    ["  ", "2W", "  ", "  ", "  ", "2W", "  "],
    ["2L", "  ", "3L", "  ", "3L", "  ", "2L"],
    ["  ", "  ", "  ", "3W", "  ", "  ", "  "],
    ["2L", "  ", "3L", "  ", "3L", "  ", "2L"],
    ["  ", "2W", "  ", "  ", "  ", "2W", "  "],
    ["  ", "  ", "2L", "  ", "2L", "  ", "  "],
].map((row) =>
    row.map((cell) => cell as Enhancement)
);


const letterLeagueRow1Col0: Enhancement[][] = [
    ["  ", "3L", "  ", "3L", "  "],
    ["2W", "  ", "  ", "  ", "2W"],
    ["  ", "3L", "  ", "3L", "  "],
].map((row) =>
    row.map((cell) => cell as Enhancement)
);

const letterLeagueRow1Col1: Enhancement[][] = [
    ["  ", "  ", "  ", "2L", "  ", "  ", "  "],
    ["  ", "  ", "  ", "2W", "  ", "  ", "  "],
    ["  ", "  ", "  ", "2L", "  ", "  ", "  "],

].map((row) =>
    row.map((cell) => cell as Enhancement)
);



function concatRowsHorizontally(...rowGroups: Enhancement[][][]): Enhancement[][] {
    // Assumes all rowGroups have the same number of rows
    return rowGroups[0].map((_, i) =>
        rowGroups.map(group => group[i]).flat()
    );
}

const letterLeagueBigRow0 = concatRowsHorizontally(
    letterLeagueRow0Col1,
    letterLeagueRow0Col0,
    letterLeagueRow0Col1,
    letterLeagueRow0Col0,
    letterLeagueRow0Col1,
    letterLeagueRow0Col0,
    letterLeagueRow0Col1,
);

const letterLeagueBigRow1 = concatRowsHorizontally(
    letterLeagueRow1Col1,
    letterLeagueRow1Col0,
    letterLeagueRow1Col1,
    letterLeagueRow1Col0,
    letterLeagueRow1Col1,
    letterLeagueRow1Col0,
    letterLeagueRow0Col1,
);


function concatRows(...rows: Enhancement[][][]): Enhancement[][] {
    const ans = []

    for (const row of rows) {
        for (const r of row) {
            ans.push([...r]); // for deep copy
        }
    }
    return ans;
}

let letterLeagueEnhancements = concatRows(
    letterLeagueBigRow0,
    letterLeagueBigRow1,
    letterLeagueBigRow0,
    letterLeagueBigRow1,
    letterLeagueBigRow0,
    letterLeagueBigRow1,
    letterLeagueBigRow0,
);


const middleRow = Math.floor(letterLeagueEnhancements.length / 2);
const middleCol = Math.floor(letterLeagueEnhancements[0].length / 2);

letterLeagueEnhancements[middleRow][middleCol] = Enhancement.START;

export { letterLeagueEnhancements };

