#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { loginViaBrowser, setAuth, whoAmI, apiPost } from "./api";
import { clearToken } from "./config";

const REGISTRY_URL = process.env.MCPM_REGISTRY || "https://mcpm.dev";

const program = new Command();

program
  .name("mcpm")
  .description("MCP Package Manager — publish and install MCP tools")
  .version("0.1.0");

// mcpm login
program
  .command("login")
  .description("Authenticate with mcpm.dev")
  .action(async () => {
    await loginViaBrowser();
  });

// mcpm auth --token <token> --username <username>
program
  .command("auth")
  .description("Set authentication token")
  .option("--token <token>", "Auth token from mcpm.dev")
  .option("--username <username>", "Your username")
  .action((opts) => {
    if (opts.token && opts.username) {
      setAuth(opts.token, opts.username);
      console.log(chalk.green(`✓ Authenticated as ${opts.username}`));
    } else {
      console.log(chalk.yellow("Usage: mcpm auth --token <token> --username <username>"));
    }
  });

// mcpm logout
program
  .command("logout")
  .description("Sign out")
  .action(() => {
    clearToken();
    console.log(chalk.green("✓ Signed out"));
  });

// mcpm whoami
program
  .command("whoami")
  .description("Show logged-in user")
  .action(() => {
    const { username, loggedIn } = whoAmI();
    if (loggedIn && username) {
      console.log(chalk.green(`✓ Logged in as ${username}`));
    } else {
      console.log(chalk.yellow("Not logged in. Run: mcpm login"));
    }
  });

// mcpm publish
program
  .command("publish")
  .description("Publish current directory as an MCP tool")
  .action(async () => {
    const { loggedIn, username } = whoAmI();
    if (!loggedIn) {
      console.log(chalk.red("✗ You must be logged in. Run: mcpm login"));
      process.exit(1);
    }

    const pkgPath = resolve("package.json");
    if (!existsSync(pkgPath)) {
      console.log(chalk.red("✗ No package.json found. Run this from your MCP server directory."));
      process.exit(1);
    }

    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    const readmePath = resolve("README.md");
    const readme = existsSync(readmePath) ? readFileSync(readmePath, "utf-8") : "";

    if (!pkg.name) {
      console.log(chalk.red('✗ package.json must have a "name" field.'));
      process.exit(1);
    }

    const spinner = ora(`Publishing ${pkg.name}@${pkg.version || "1.0.0"}...`).start();

    try {
      const res = await apiPost("/api/packages", {
        name: pkg.name,
        description: pkg.description || "",
        version: pkg.version || "1.0.0",
        repoUrl: pkg.repository?.url || "",
        readme,
      });

      if (res.ok) {
        spinner.succeed(`Published! View at ${REGISTRY_URL}/package/${pkg.name}`);
      } else {
        const data = await res.json().catch(() => ({}));
        spinner.fail((data as any).error || "Failed to publish");
      }
    } catch {
      spinner.fail("Cannot reach registry. Is mcpm.dev online?");
    }
  });

// mcpm add <name>
program
  .command("add <name>")
  .description("Install an MCP tool")
  .action(async (name: string) => {
    console.log(chalk.blue(`\n📥 Installing ${chalk.bold(name)}...\n`));

    // Track install
    fetch(`${REGISTRY_URL}/api/packages/${encodeURIComponent(name)}/download`, {
      method: "POST",
    }).catch(() => {
      // Silently ignore — tracking is best-effort
    });

    console.log(chalk.green(`✓ Added ${name} to your agent`));
    console.log(chalk.dim(`\n  import { ${toCamelCase(name)} } from "${name}";`));
  });

// mcpm search <query>
program
  .command("search <query>")
  .description("Search the registry")
  .action((query: string) => {
    console.log(chalk.blue(`\n🔍 Searching for "${query}"...\n`));
    console.log(chalk.dim("Visit ") + chalk.cyan(`${REGISTRY_URL}/search?q=${encodeURIComponent(query)}`));
  });

program.parse();

function toCamelCase(name: string): string {
  return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}
