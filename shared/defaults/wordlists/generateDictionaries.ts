import * as fs from "fs";
import * as path from "path";
// i ran this with ts-node idk if thats optimal

 async function convertFilesToJson(srcDir: string, destDir: string): Promise<void> {
    await fs.promises.mkdir(destDir, { recursive: true });

    const files = await fs.promises.readdir(srcDir);

    for (const file of files) {
        const srcPath = path.join(srcDir, file);
        const destPath = path.join(destDir, `${path.parse(file).name}.json`);

        const stat = await fs.promises.stat(srcPath);
        if (stat.isFile()) {
            const content = await fs.promises.readFile(srcPath, "utf-8");

            const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);

            await fs.promises.writeFile(destPath, JSON.stringify(lines, null, 2), "utf-8");

            console.log(`Converted ${file} to ${path.basename(destPath)}`);
        }
    }
}

convertFilesToJson("./txt", "./json")
