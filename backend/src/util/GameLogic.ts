import seedrandom from "seedrandom";
import { Spell } from "shared/types/spells";
import { Enchantment, EnchantmentRate, Tile } from "shared/types/tiles";
import { DefaultEnchantmentRate, BoostedEnchantmentRate } from "shared/defaults/Enchantments";
import { LetterPoints, Letter } from "shared/types/misc";

function getRandomEnchantment(rng: seedrandom.PRNG, rates: EnchantmentRate): Enchantment {
    const roll = rng();
    let cumulative = 0;

    for (const enchantment of Object.values(Enchantment)) {
        // why are ts enums so stupid????
        if (typeof enchantment === "number") {
            cumulative += rates[enchantment as Enchantment];
            if (roll < cumulative) {
                return enchantment as Enchantment;
            }
        }
    }
    // Fallback: return BASE if something goes wrong
    return Enchantment.BASE;
}

export async function drawTiles(
    bag: string[],
    hand: Tile[],
    handSize: number,
    purchasedSpells: Array<Spell>,
    seed: number,
    points: LetterPoints
): Promise<Tile[]> {
    const containsPaintBrush = purchasedSpells.some((spell) => spell.type === "PaintBrush");
    const containsHone = purchasedSpells.some((spell) => spell.type === "Hone");

    const numNegatives = hand.filter((tile) => tile.enchantment === Enchantment.NEGATIVE).length;

    let newHandSize = containsPaintBrush ? handSize + 1 : handSize;
    newHandSize += numNegatives;

    let missingTiles = newHandSize - hand.length;

    const saltedSeed = seed.toString() + bag.toString();
    const rng = seedrandom(saltedSeed);

    const EnchantmentRates = containsHone ? BoostedEnchantmentRate : DefaultEnchantmentRate;

    const drawnTiles: Tile[] = [];

    for (let i = 0; i < missingTiles; i++) {
        if (bag.length === 0) break;

        const letter = bag.pop();

        const enchantment = getRandomEnchantment(rng, EnchantmentRates);
        const tile: Tile = {
            letter: letter!,
            points: points[letter as Letter] || 0,
            position: null,
            enchantment,
        };

        if (enchantment === Enchantment.NEGATIVE) {
            missingTiles += 1;
        }

        drawnTiles.push(tile);
    }

    return drawnTiles;
}
