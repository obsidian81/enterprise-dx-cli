import { OpenAPISpec } from "../utils/fileLoader.js";
import { Rule, LintResult } from "./types.js";
import { correlationIdRule } from "./correlationIdRule.js";
import { errorSchemaRule } from "./errorSchemaRule.js";
import { kebabCasePathRule } from "./kebabCasePathRule.js";
import { GovernanceConfig } from "../utils/configLoader.js";

const allRules: Record<string, Rule> = {
  [correlationIdRule.id]: correlationIdRule,
  [errorSchemaRule.id]: errorSchemaRule,
  [kebabCasePathRule.id]: kebabCasePathRule,
};

export function runGovernanceChecks(
  spec: OpenAPISpec,
  config?: GovernanceConfig | null
): LintResult[] {
  const results: LintResult[] = [];

  for (const [ruleId, rule] of Object.entries(allRules)) {
    const ruleCfg = config?.rules?.[ruleId];

    // Check if explicitly disabled
    if (ruleCfg === false) continue;
    if (typeof ruleCfg === "object" && ruleCfg.enabled === false) continue;

    // Run rule validation
    const ruleResults = rule.validate(spec);

    // Apply severity override if defined in config
    const customSeverity =
      typeof ruleCfg === "object" && ruleCfg.severity
        ? ruleCfg.severity
        : rule.severity;

    ruleResults.forEach((res) => {
      res.severity = customSeverity;
      results.push(res);
    });
  }

  return results;
}


