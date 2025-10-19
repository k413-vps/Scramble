import {
    ActionData,
    ActionType,
    PassAction,
    PlaceAction,
    SacrificeAction,
    ShuffleAction,
    WriteAction,
} from "shared/types/actions";
import { ActionHistory, ClientPlayerMap, HistoryElement, HistoryType, SpellHistory } from "shared/types/game";
import {
    BlockSpellData,
    CurseSpellData,
    GrabberSpellData,
    HieroglyphSpellData,
    HoneSpellData,
    ManifestSpellData,
    PaintBrushSpellData,
    PetroglyphSpellData,
    PictographSpellData,
    SpellData,
    SpellType,
    SwapSpellData,
} from "shared/types/spells";

export function getMessage(players: ClientPlayerMap, history?: HistoryElement): string | undefined {
    if (history === undefined) {
        return undefined
    }

    if (history.type === HistoryType.ACTION) {
        return getMessageAction((history as ActionHistory).actionData, players);
    } else if (history.type === HistoryType.SPELL) {
        return getMessageSpell((history as SpellHistory).spellData, players);
    }

    return "mysterious history element";
}

export function getMessageAction(actionData: ActionData, players: ClientPlayerMap): string {
    const name = players[actionData.playerId]?.name;
    if (actionData.type === ActionType.PLAY) {
        return getMessageActionPlay(actionData as PlaceAction, name);
    } else if (actionData.type === ActionType.PASS) {
        return getMessageActionPass(actionData as PassAction, name);
    } else if (actionData.type === ActionType.SHUFFLE) {
        return getMessageActionShuffle(actionData as ShuffleAction, name);
    } else if (actionData.type === ActionType.WRITE) {
        return getMessageActionWrite(actionData as WriteAction, name);
    } else if (actionData.type === ActionType.SACRIFICE) {
        return getMessageActionSacrifice(actionData as SacrificeAction, name);
    }

    return "unknown action";
}

function getMessageActionPlay(actionData: PlaceAction, name: string): string {
    const words = actionData.wordsFormed.join(", ");
    return `${name} played ${words} for ${actionData.points} points and ${actionData.mana} mana`;
}

function getMessageActionPass(actionData: PassAction, name: string): string {
    return `${name} passed their turn`;
}

function getMessageActionShuffle(actionData: ShuffleAction, name: string): string {
    return `${name} shuffled their hand`;
}

function getMessageActionWrite(actionData: WriteAction, name: string): string {
    return `${name} did an illegal action somehow`;
}

function getMessageActionSacrifice(actionData: SacrificeAction, name: string): string {
    return `${name} sacrificed ${Math.abs(actionData.points)} points for ${actionData.mana} mana`;
}

function getMessageSpell(spellData: SpellData, players: ClientPlayerMap): string {
    const name = players[spellData.playerId]?.name;
    if (spellData.type === SpellType.PAINTBRUSH) {
        return getMessageSpellPaintbrush(spellData as PaintBrushSpellData, name);
    } else if (spellData.type === SpellType.BLOCK) {
        return getMessageSpellBlock(spellData as BlockSpellData, name);
    } else if (spellData.type === SpellType.CURSE) {
        return getMessageSpellCurse(spellData as CurseSpellData, name);
    } else if (spellData.type === SpellType.GRABBER) {
        const targetPlayerName = players[(spellData as GrabberSpellData).targetPlayerId]?.name;
        return getMessageSpellGrabber(spellData as GrabberSpellData, name, targetPlayerName);
    } else if (spellData.type === SpellType.PICTOGRAPH) {
        return getMessageSpellPictograph(spellData as PictographSpellData, name);
    } else if (spellData.type === SpellType.PETROGLYPH) {
        return getMessageSpellPetroglyph(spellData as PetroglyphSpellData, name);
    } else if (spellData.type === SpellType.HIEROGLYPH) {
        return getMessageSpellHieroglyph(spellData as HieroglyphSpellData, name);
    } else if (spellData.type === SpellType.HONE) {
        return getMessageSpellHone(spellData as HoneSpellData, name);
    } else if (spellData.type === SpellType.MANIFEST) {
        return getMessageSpellManifest(spellData as ManifestSpellData, name);
    } else if (spellData.type === SpellType.SWAP) {
        return getMessageSpellSwap(spellData as SwapSpellData, name);
    }

    return "unknown spell";
}

function getMessageSpellPaintbrush(spellData: PaintBrushSpellData, name: string): string {
    return `${name} cast Paintbrush to permanently increase their hand size`;
}

function getMessageSpellBlock(spellData: BlockSpellData, name: string): string {
    return `${name} cast Block to block a square from being played!`;
}

function getMessageSpellCurse(spellData: CurseSpellData, name: string): string {
    return `${name} cast Curse on on a secret position!`;
}

function getMessageSpellGrabber(spellData: GrabberSpellData, name: string, targetPlayerName: string): string {
    return `${name} used Grabber on ${targetPlayerName}`;
}

function getMessageSpellPictograph(spellData: PictographSpellData, name: string): string {
    return `${name} cast Pictograph and drew a negative letter (worth 1-3 points)`;
}

function getMessageSpellPetroglyph(spellData: PetroglyphSpellData, name: string): string {
    return `${name} cast Petroglyph and drew a negative letter (worth 4+ points)`;
}

function getMessageSpellHieroglyph(spellData: HieroglyphSpellData, name: string): string {
    return `${name} cast Hieroglyph and drew a negative blank tile`;
}

function getMessageSpellHone(spellData: HoneSpellData, name: string): string {
    return `${name} cast Hone to increase the chance of enchantments`;
}

function getMessageSpellManifest(spellData: ManifestSpellData, name: string): string {
    return `${name} cast Manifest to create a ${spellData.type}`;
}

function getMessageSpellSwap(spellData: SwapSpellData, name: string): string {
    return `${name} cast Swap at for ${spellData.points} points`;
}
