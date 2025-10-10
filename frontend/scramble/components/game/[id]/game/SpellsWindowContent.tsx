import { useGameStore } from "@/utils/game/[id]/store";
import SpellsEntry from "./SpellsEntry";
import { spells, SpellType } from "shared/types/spells";

export default function SpellsWindowContent() {
    const player = useGameStore((state) => state.getPlayer());

    const mana = player === null ? -1 : player.mana;

    console.log("spells", spells, SpellType.PAINTBRUSH);

    return (
        <div
            style={{
                padding: "16px",
                overflowY: "auto",
                height: "100%",
                backgroundColor: "#000000",
                color: "var(--color-card-foreground)",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "visible",
            }}
        >
            <div>
                {/* {spellList.map((spell, index) => (
                    <SpellsEntry key={spell.type} spell={spell} index={index} mana={mana} />
                ))} */}

                <SpellsEntry spell={spells[SpellType.PAINTBRUSH]} index={0} mana={mana} />
                <SpellsEntry spell={spells[SpellType.BLOCK]} index={1} mana={mana} />
                <SpellsEntry spell={spells[SpellType.CURSE]} index={2} mana={mana} />
                <SpellsEntry spell={spells[SpellType.GRABBER]} index={3} mana={mana} />
                <SpellsEntry spell={spells[SpellType.PICTOGRAPH]} index={4} mana={mana} />
                <SpellsEntry spell={spells[SpellType.PETROGLYPH]} index={5} mana={mana} />
                <SpellsEntry spell={spells[SpellType.HIEROGLYPH]} index={6} mana={mana} />
                <SpellsEntry spell={spells[SpellType.HONE]} index={7} mana={mana} />
                <SpellsEntry spell={spells[SpellType.MANIFEST]} index={8} mana={mana} />
                <SpellsEntry spell={spells[SpellType.SWAP]} index={9} mana={mana} />
            </div>
        </div>
    );
}
