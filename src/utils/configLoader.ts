import fs from "fs";
import path from "path";
import YAML from "yaml";
import { RuleSeverity } from "../rules/types.js";

export interface RuleConfig {
  enabled: boolean;
  severity?: RuleSeverity;
}

export interface GovernanceConfig {
  rules: Record<string, RuleConfig | boolean>;
}

export function loadConfigFile(configPath?: string): GovernanceConfig | null {
  const targetPath = configPath
    ? path.resolve(process.cwd(), configPath)
    : path.resolve(process.cwd(), ".api-governancerc.yaml");

  if (!fs.existsSync(targetPath)) {
    return null;
  }

  const fileContent = fs.readFileSync(targetPath, "utf8");
  return YAML.parse(fileContent) as GovernanceConfig;
}




