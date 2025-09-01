import { z } from "zod";
import { DictionaryEnum } from "shared/types/game";


const boardEnums = z.enum(["letter league", "scrabble"])
const lengthEnums =  z.enum(["short", "medium", "long"])
const dictionaryEnums = z.nativeEnum(DictionaryEnum)


export const createGameFormSchema = z.object({
    handSize: z.coerce.number().min(5, "Handsize is at least 5").max(20, "Handsize can't be more than 20"),
    board: boardEnums,
    length: lengthEnums,
    dictionary: dictionaryEnums,
    wildMode: z.boolean(),
    enableEnchantments: z.boolean(),
    enableSpecialActions: z.boolean(),
    public: z.boolean(),
    timePerTurn: z.union([
        z.coerce
            .number({
                invalid_type_error: "Time has to be a number",
            })
            .min(30, "Atleast 30 seconds needed")
            .max(600, "Can't be more than 10 minutes"),
        z.literal(""),
    ]),
    seed: z.union([
        z.coerce
            .number({
                invalid_type_error: "Seed must be a 10 digit number",
            })
            .min(1000000000, "Seed must be 10 digits")
            .max(9999999999, "Seed must be 10 digits"),
        z.literal(""),
    ]),
});


export type BoardEnums = z.infer<typeof boardEnums>;
export type LengthEnums = z.infer<typeof lengthEnums>;
export type DictionaryEnums = z.infer<typeof dictionaryEnums>;
export type CreateGameFormValues = z.infer<typeof createGameFormSchema>;
