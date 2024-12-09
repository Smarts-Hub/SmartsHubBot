import { readFileSync } from 'fs';
import { parse } from 'yaml';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const configPath = path.join(__dirname, '../config.yml');

export const config = parse(readFileSync(configPath, 'utf8'));
