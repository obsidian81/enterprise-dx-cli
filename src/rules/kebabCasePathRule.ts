import { Rule, LintResult } from "./types.js";
import { OpenAPISpec } from "../utils/fileLoader.js";

export const kebabCasePathRule: Rule = {
  id: "PATH-003-KEBAB-CASE",
  description: "All URL path segments must use kebab-case",
  severity: "error",
  validate: (spec: OpenAPISpec): LintResult[] => {
    const results: LintResult[] = [];
    const paths = spec.paths || {};

    const kebabCaseRegex = /^\/([a-z0-9-]+|\{[a-zA-Z0-9_]+\})(\/([a-z0-9-]+|\{[a-zA-Z0-9_]+\}))*$/;

    for (const pathKey of Object.keys(paths)) {
      if (!kebabCaseRegex.test(pathKey)) {
        results.push({
          ruleId: "PATH-003-KEBAB-CASE",
          message: `Path '${pathKey}' violates kebab-case naming standard. Use lowercase with hyphens (e.g. /payment-methods).`,
          severity: "error",
          path: `paths.${pathKey}`,
        });
      }
    }

    return results;
  },
};


