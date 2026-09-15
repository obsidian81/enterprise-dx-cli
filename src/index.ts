import { Command } from "commander";
import pc from "picocolors";
import { loadSpecFile } from "./utils/fileLoader.js";
import { loadConfigFile } from "./utils/configLoader.js";
import { runGovernanceChecks } from "./rules/engine.js";
import { renderOutput, OutputFormat, type ReporterViolation } from "./reporters.js";

const program = new Command();

program
  .name("enterprise-dx-cli")
  .description("Enterprise-grade API Governance & Linting CLI")
  .version("1.0.0");

program
  .command("lint")
  .description("Lint an OpenAPI specification file against governance rules")
  .argument("<specPath>", "Path to OpenAPI spec file (JSON or YAML)")
  .option("-c, --config <configPath>", "Path to governance configuration file")
  .option("-f, --format <format>", "Output format: table, json, or junit", "table")
  .action((specPath: string, options: { config?: string; format: OutputFormat }) => {
    try {
      const isJsonOrJunit = options.format === "json" || options.format === "junit";

      if (!isJsonOrJunit) {
        console.log(`${pc.cyan("[INFO]")} Parsing spec file: ${pc.bold(specPath)}`);
      }

      const spec = loadSpecFile(specPath);
      const config = loadConfigFile(options.config);

      if (!isJsonOrJunit && config) {
        console.log(`${pc.cyan("[CONFIG]")} Loaded governance configuration.`);
      }

      if (!isJsonOrJunit) {
        console.log(
          `${pc.green("[LOADED]")} API Title: "${pc.bold(spec.info?.title || "Unknown")}" (v${spec.info?.version || "0.0.0"})`
        );
        console.log(`${pc.cyan("[RUNNING]")} Executing governance checks...\n`);
      }

      const violations = runGovernanceChecks(spec, config);
      const normalizedViolations = violations.map((violation) => ({
        ...violation,
        severity: (violation.severity === "warning" ? "warn" : violation.severity) as "error" | "warn",
      })) as ReporterViolation[];
      const renderedResult = renderOutput(normalizedViolations, options.format);
      console.log(renderedResult);

      const hasErrors = normalizedViolations.some((v) => v.severity === "error");
      if (hasErrors) {
        process.exitCode = 1;
      }
    } catch (error: any) {
      console.error(`${pc.red("[ERROR]")} ${error.message}`);
      process.exitCode = 1;
    }
  });

program.parse(process.argv);