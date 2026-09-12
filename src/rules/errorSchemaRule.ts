import { Rule, LintResult } from "./types.js";
import { OpenAPISpec } from "../utils/fileLoader.js";

export const errorSchemaRule: Rule = {
  id: "ERR-002-RFC7807-SCHEMA",
  description: "All HTTP 4xx/5xx responses must reference an explicit error object schema",
  severity: "error",
  validate: (spec: OpenAPISpec): LintResult[] => {
    const results: LintResult[] = [];
    const paths = spec.paths || {};

    for (const [pathKey, pathItem] of Object.entries(paths)) {
      const operations = ["get", "post", "put", "delete", "patch"];

      for (const method of operations) {
        const operation = (pathItem as Record<string, any>)[method];
        if (!operation) continue;

        const responses = operation.responses || {};
        const errorStatusCodes = Object.keys(responses).filter((code) =>
          /^[45]\d\d$/.test(code) || code === "default"
        );

        if (errorStatusCodes.length === 0) {
          results.push({
            ruleId: "ERR-002-RFC7807-SCHEMA",
            message: `Operation ${method.toUpperCase()} ${pathKey} must declare at least one explicit 4xx/5xx or default error response`,
            severity: "error",
            path: `paths.${pathKey}.${method}.responses`,
          });
        }
      }
    }
    return results;
  },
};






