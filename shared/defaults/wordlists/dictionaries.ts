import { Dictionary, DictionaryEnum } from "../../types/game";
import sowpods from "./json/sowpods.json";
import twl06 from "./json/twl06.json";

const sowpodsDict: Set<string> = new Set(sowpods);
const twl06Dict: Set<string> = new Set(twl06);

export function getDictionary(dict: DictionaryEnum): Dictionary {
    switch (dict) {
        case DictionaryEnum.sowpods:
            return sowpodsDict;
        case DictionaryEnum.twl06:
            return twl06Dict;
    }
}
