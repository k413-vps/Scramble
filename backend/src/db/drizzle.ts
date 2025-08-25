import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import dotenv from "dotenv";
import path from "path";

const env = process.argv[2] || "dev2";
const envFile = `.env.${env}`;

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const postgresURL = process.env.POSTGRES_URL!;

const db = drizzle(postgresURL!);

export default db;
