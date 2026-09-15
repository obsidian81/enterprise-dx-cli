import pc from "picocolors";
import Table from "cli-table3";

export type OutputFormat = "table" | "json" | "junit";

export interface ReporterViolation {
  ruleId: string;
  severity: "error" | "warn";
  path?: string;
  message: string;
}

export function renderOutput(violations: ReporterViolation[], format: OutputFormat = "table"): string {
  switch (format.toLowerCase()) {
    case "json":
      return renderJson(violations);
    case "junit":
      return renderJUnit(violations);
    case "table":
    default:
      return renderTable(violations);
  }
}

function renderJson(violations: ReporterViolation[]): string {
  return JSON.stringify(
    {
      summary: {
        totalViolations: violations.length,
        errors: violations.filter((v) => v.severity === "error").length,
        warnings: violations.filter((v) => v.severity === "warn").length,
      },
      violations,
    },
    null,
    2
  );
}

function renderJUnit(violations: ReporterViolation[]): string {
  const errorsCount = violations.filter((v) => v.severity === "error").length;
  const failureXmls = violations
    .map((v) => {
      const type = v.severity === "error" ? "Error" : "Warning";
      const escapedMsg = escapeXml(v.message);
      const escapedPath = escapeXml(v.path || "N/A");
      return `    <testcase name="${v.ruleId}" classname="${escapedPath}">\n      <failure message="${escapedMsg}" type="${type}">${escapedMsg} (Path: ${escapedPath})</failure>\n    </testcase>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<testsuites tests="${violations.length}" failures="${errorsCount}">\n  <testsuite name="Enterprise DX Governance Linter" tests="${violations.length}" failures="${errorsCount}">\n${failureXmls}\n  </testsuite>\n</testsuites>`;
}

function renderTable(violations: ReporterViolation[]): string {
  if (violations.length === 0) {
    return `${pc.bgGreen(pc.black(" PASSED "))} ${pc.green("Spec complies with all active governance rules.")}`;
  }

  let output = `${pc.bgRed(pc.white(" VIOLATIONS DETECTED "))} Found ${pc.bold(violations.length)} issue(s):\n\n`;

  const table = new Table({
    head: [pc.bold("Severity"), pc.bold("Rule ID"), pc.bold("Path"), pc.bold("Message")],
    colWidths: [12, 26, 26, 45],
    wordWrap: true,
  });

  violations.forEach((v) => {
    const severityTag = v.severity === "error" ? pc.red("ERROR") : pc.yellow("WARN");
    table.push([severityTag, pc.cyan(v.ruleId), v.path || "N/A", v.message]);
  });

  output += table.toString();
  return output;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}