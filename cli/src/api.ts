import { getToken, getUsername, saveToken } from "./config.js";
import chalk from "chalk";

const REGISTRY_URL = process.env.MCPM_REGISTRY || "https://mcpm.dev";

export async function apiPost(path: string, body: Record<string, unknown>) {
  const token = getToken();
  const res = await fetch(`${REGISTRY_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  return res;
}

export async function apiGet(path: string) {
  const res = await fetch(`${REGISTRY_URL}${path}`);
  return res;
}

export async function loginViaBrowser(): Promise<void> {
  console.log(chalk.blue("\n🔑 Opening mcpm.dev to authenticate...\n"));
  console.log(`Visit: ${chalk.cyan(`${REGISTRY_URL}/cli-login`)}`);
  console.log("");
  console.log("After logging in, copy the token below and run:");
  console.log(chalk.green("  mcpm auth --token <your-token>"));
}

export function setAuth(token: string, username: string): void {
  saveToken(token, username);
}

export function whoAmI(): { username: string | null; loggedIn: boolean } {
  const username = getUsername();
  const token = getToken();
  return { username, loggedIn: !!token };
}
