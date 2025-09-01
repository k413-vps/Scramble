import { Dictionary } from "../../types/game";
import * as fs from "fs";

function exportJsonFile(sourcePath: string): Dictionary {
    try {
        const fileContent = fs.readFileSync(sourcePath, "utf-8");

        const jsonData: Dictionary = JSON.parse(fileContent);

        return jsonData;
    } catch (error) {
        console.error(`Error exporting JSON file: ${error}`);
        return [];
    }
}

// export const sowpods = exportJsonFile("./json/sowpods.json");
export const twl06 = exportJsonFile("./json/twl06.json");
