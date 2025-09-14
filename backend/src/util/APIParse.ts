import { generateSeed, shuffle } from "shared/functions/util";
import { CreateGameRequest } from "shared/types/API";
import { Enhancement, ServerSideGame } from "shared/types/game";
import seedrandom from "seedrandom";

const M_RATE = 0.2;

export function parseCreateGameRequest(data: CreateGameRequest): ServerSideGame {
    const seed = data.seed != "" ? data.seed : generateSeed();
    const timePerTurn = data.timePerTurn > 0 ? data.timePerTurn : 0;

    const rng = seedrandom(seed.toString());

    const rows = data.enhancements.length;
    const cols = data.enhancements[0].length;
    const board: null[][] = Array.from({ length: rows }, () => Array(cols).fill(null));

    const enchantments = Array.from(data.enhancements);
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const enhancement = enchantments[r][c];
            if (enhancement == Enhancement.NONE && rng() < M_RATE) {
                enchantments[r][c] = Enhancement.MANA;
            }
        }
    }

    console.log(data.letterFrequency);
    const bag = Object.entries(data.letterFrequency).flatMap(([letter, count]) => Array(count).fill(letter));
    const shuffledBag = shuffle(bag, rng);

    const ans: ServerSideGame = {
        players: [],
        board: board,
        enhancements: enchantments,
        currentPlayerId: "",
        bag: shuffledBag,
        turnHistory: [],
        timePerTurn: timePerTurn,
        timeOfLastTurn: 0, // set when game starts
        dictionary: data.dictionary,
        wildMode: data.wildMode,
        points: data.points,
        enableEnchantments: data.enableEnchantments,
        enableSpecialActions: data.enableSpecialActions,
        public: data.public,
        handSize: data.handSize,
        seed: seed,
        randomSeed: data.seed == "",
        gameStarted: false,
        ownerId: "",
    };

    return ans;
}
