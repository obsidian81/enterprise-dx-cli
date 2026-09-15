import { OpenAPISpec } from "../utils/fileLoader.js";

export type RuleSeverity = "error" | "warning" | "info";

export interface LintResult {
  ruleId: string;
  message: string;
  severity: RuleSeverity;
  path?: string;
}

export interface Rule {
  id: string;
  description: string;
  severity: RuleSeverity;
  validate: (spec: OpenAPISpec) => LintResult[];
}










