import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const CONFIG_DIR = join(homedir(), ".mcpm");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

interface Config {
  token?: string;
  username?: string;
}

export function ensureConfig(): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
  if (!existsSync(CONFIG_FILE)) {
    writeFileSync(CONFIG_FILE, JSON.stringify({}));
  }
}

export function readConfig(): Config {
  ensureConfig();
  return JSON.parse(readFileSync(CONFIG_FILE, "utf-8"));
}

export function writeConfig(config: Config): void {
  ensureConfig();
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export function saveToken(token: string, username: string): void {
  writeConfig({ token, username });
}

export function clearToken(): void {
  writeConfig({});
}

export function getToken(): string | null {
  const config = readConfig();
  return config.token || null;
}

export function getUsername(): string | null {
  const config = readConfig();
  return config.username || null;
}
