#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { loginViaBrowser, setAuth, whoAmI, apiPost, apiGet } from "./api.js";
import { readConfig, writeConfig, clearToken } from "./config.js";

const REGISTRY_URL = process.env.MCPM_REGISTRY || "https://mcpm.dev";

const program = new Command();

program
  .name("mcpm-dev")
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

// mcpm-dev publish
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

    // Read mcpm.json if present
    const mcpmPath = resolve("mcpm.json");
    let mcp = null;
    if (existsSync(mcpmPath)) {
      try {
        mcp = JSON.parse(readFileSync(mcpmPath, "utf-8")).mcp;
        if (mcp) {
          console.log(chalk.dim("  Found mcpm.json — MCP configuration included"));
        }
      } catch {
        console.log(chalk.yellow("  ⚠ mcpm.json is invalid, skipping"));
      }
    }

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
        repoUrl: pkg.repository?.url || pkg.homepage || "",
        readme,
        mcp,
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

// mcpm-dev add <name>
program
  .command("add <name>")
  .description("Install an MCP tool")
  .action(async (name: string) => {
    const spinner = ora(`Fetching ${name}...`).start();

    try {
      const res = await apiGet(`/api/packages/${encodeURIComponent(name)}`);
      if (res.status === 404) {
        spinner.fail(`Package "${name}" not found on mcpm.dev`);
        console.log(chalk.dim("\n  Search: mcpm-dev search " + name.split("-")[0]));
        process.exit(1);
      }
      if (!res.ok) {
        spinner.fail(`Failed to fetch package info`);
        process.exit(1);
      }

      const pkg = await res.json();
      spinner.succeed(chalk.green(`Found ${pkg.name} v${pkg.version} by ${pkg.username}`));

      console.log(chalk.dim(`\n  ${pkg.description}`));
      console.log(chalk.dim(`  Repo: ${pkg.repoUrl || "N/A"}`));

      // Track install
      apiPost(`/api/packages/${encodeURIComponent(name)}/download`, {}).catch(() => {});

      // Save to installed list
      const config = readConfig();
      const installed = config.installed || [];
      if (!installed.includes(name)) {
        installed.push(name);
        writeConfig({ ...config, installed });
      }

      console.log(chalk.green(`\n✓ ${name} added to your MCP client`));

      // Show MCP client config using mcpm.json if available, or default
      const mcp = pkg.mcp;
      if (mcp) {
        console.log(chalk.bold("\n📋 MCP Client Configuration:"));
        console.log(chalk.dim("\n  Add this to your MCP client config:\n"));
        console.log(chalk.cyan(`  {`));
        console.log(chalk.cyan(`    "mcpServers": {`));
        console.log(chalk.cyan(`      "${name}": {`));
        console.log(chalk.cyan(`        "command": "${mcp.command || "node"}",`));
        if (mcp.args) console.log(chalk.cyan(`        "args": ${JSON.stringify(mcp.args)},`));
        if (mcp.env && Object.keys(mcp.env).length) console.log(chalk.cyan(`        "env": ${JSON.stringify(mcp.env)},`));
        console.log(chalk.cyan(`      }`));
        console.log(chalk.cyan(`    }`));
        console.log(chalk.cyan(`  }`));
      } else {
        console.log(chalk.bold("\n📋 MCP Client Configuration:"));
        console.log(chalk.dim("\n  Add this to your MCP client config:\n"));
        console.log(chalk.cyan(`  {`));
        console.log(chalk.cyan(`    "mcpServers": {`));
        console.log(chalk.cyan(`      "${name}": {`));
        console.log(chalk.cyan(`        "command": "npx",`));
        console.log(chalk.cyan(`        "args": ["-y", "${name}"]`));
        console.log(chalk.cyan(`      }`));
        console.log(chalk.cyan(`    }`));
        console.log(chalk.cyan(`  }`));
      }

      if (pkg.readme) {
        console.log(chalk.dim(`\n  Run "mcpm-dev info ${name}" for full README`));
      }
    } catch {
      spinner.fail("Cannot reach registry. Is mcpm.dev online?");
      process.exit(1);
    }
  });

// mcpm-dev info <name>
program
  .command("info <name>")
  .description("Show package details and README")
  .action(async (name: string) => {
    const spinner = ora(`Loading ${name}...`).start();

    try {
      const res = await apiGet(`/api/packages/${encodeURIComponent(name)}`);
      if (res.status === 404) {
        spinner.fail(`Package "${name}" not found`);
        process.exit(1);
      }
      const pkg = await res.json();
      spinner.stop();

      console.log(chalk.bold(`\n${pkg.name} v${pkg.version}`));
      console.log(chalk.dim(`by ${pkg.username} — ${pkg.downloads} installs`));
      console.log(`\n${pkg.description}`);

      if (pkg.readme) {
        console.log(chalk.bold("\n─── README ───"));
        console.log(pkg.readme);
      }
    } catch {
      spinner.fail("Cannot reach registry");
      process.exit(1);
    }
  });

// mcpm search <query>
program
  .command("search <query>")
  .description("Search the registry")
  .action(async (query: string) => {
    const spinner = ora(`Searching for "${query}"...`).start();

    try {
      const res = await apiGet(`/api/search?q=${encodeURIComponent(query)}`);
      const results = await res.json();

      spinner.stop();

      if (results.length === 0) {
        console.log(chalk.yellow(`\nNo packages found for "${query}"`));
        console.log(chalk.dim("  Try a different search term or publish your own:"));
        console.log(chalk.dim("  mcpm-dev publish"));
        return;
      }

      console.log(chalk.bold(`\nFound ${results.length} package${results.length > 1 ? "s" : ""}:\n`));

      for (const pkg of results) {
        console.log(chalk.cyan(`  ${pkg.name}`) + chalk.dim(` v${pkg.version || "?"}`));
        console.log(chalk.dim(`    ${pkg.description}`));
        console.log(chalk.dim(`    by ${pkg.username} — ${pkg.downloads} installs`));
        console.log();
      }

      console.log(chalk.dim(`  Install: mcpm-dev add <name>`));
    } catch {
      spinner.fail("Cannot reach registry");
    }
  });

program.parse();
