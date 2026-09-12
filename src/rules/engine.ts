


import { OpenAPISpec } from "../utils/fileLoader.js";
import { Rule, LintResult } from "./types.js";
import { correlationIdRule } from "./correlationIdRule.js";
import { errorSchemaRule } from "./errorSchemaRule.js";
import { kebabCasePathRule } from "./kebabCasePathRule.js";

const defaultRules: Rule[] = [
  correlationIdRule,
  errorSchemaRule,
  kebabCasePathRule,
];

export function runGovernanceChecks(spec: OpenAPISpec): LintResult[] {
  const results: LintResult[] = [];
  for (const rule of defaultRules) {
    const ruleResults = rule.validate(spec);
    results.push(...ruleResults);
  }
  return results;
}

