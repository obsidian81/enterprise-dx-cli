import fs from 'fs';
import path from 'path';
import YAML from 'yaml';

export interface OpenAPISpec {
  openapi?: string;
  swagger?: string;
  info?: {
    title?: string;
    version?: string;
  };
  paths?: Record<string, any>;
  [key: string]: any;
}

export function loadSpecFile(filePath: string): OpenAPISpec {
  const resolvedPath = path.resolve(process.cwd(), filePath);

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Specification file not found at path: ${resolvedPath}`);
  }

  const fileContent = fs.readFileSync(resolvedPath, 'utf8');

  if (filePath.endsWith('.json')) {
    return JSON.parse(fileContent);
  } else if (filePath.endsWith('.yaml') || filePath.endsWith('.yml')) {
    return YAML.parse(fileContent);
  } else {
    return YAML.parse(fileContent);
  }
}







