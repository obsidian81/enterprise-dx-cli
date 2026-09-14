import { Rule, LintResult } from "./types.js";
import { OpenAPISpec } from "../utils/fileLoader.js";

export const correlationIdRule: Rule = {
  id: "REQ-001-CORRELATION-ID",
  description: "All operations must define an X-Correlation-ID header parameter",
  severity: "error",
  validate: (spec: OpenAPISpec): LintResult[] => {
    const results: LintResult[] = [];
    const paths = spec.paths || {};

    for (const [pathKey, pathItem] of Object.entries(paths)) {
      const operations = ["get", "post", "put", "delete", "patch"];
      for (const method of operations) {
        const operation = (pathItem as Record<string, any>)[method];
        if (!operation) continue;

        const parameters = operation.parameters || [];
        const hasCorrelationId = parameters.some(
          (param: any) =>
            param.in === "header" &&
            param.name?.toLowerCase() === "x-correlation-id"
        );

        if (!hasCorrelationId) {
          results.push({
            ruleId: "REQ-001-CORRELATION-ID",
            message: `Operation ${method.toUpperCase()} ${pathKey} is missing required header 'X-Correlation-ID'`,
            severity: "error",
            path: `paths.${pathKey}.${method}`,
          });
        }
      }
    }
    return results;
  },
};








