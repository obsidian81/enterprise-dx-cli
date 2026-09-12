import pc from 'picocolors';
import Table from 'cli-table3';
import { loadSpecFile } from './utils/fileLoader.js';
import { runGovernanceChecks } from './rules/engine.js';

const [command, specPath] = process.argv.slice(2);

if (command === 'lint' && specPath) {
    try {
      console.log(`${pc.cyan('[INFO]')} Parsing spec file: ${pc.bold(specPath)}`);
      const spec = loadSpecFile(specPath);
      
      console.log(`${pc.green('[LOADED]')} API Title: "${pc.bold(spec.info?.title || 'Unknown')}" (v${spec.info?.version || '0.0.0'})`);
      console.log(`${pc.cyan('[RUNNING]')} Executing governance checks...\n`);

      const violations = runGovernanceChecks(spec);

      if (violations.length === 0) {
        console.log(`${pc.bgGreen(pc.black(' PASSED '))} ${pc.green('Spec complies with all active governance rules.')}`);
      } else {
        console.log(`${pc.bgRed(pc.white(' VIOLATIONS DETECTED '))} Found ${pc.bold(violations.length)} issue(s):\n`);

        const table = new Table({
          head: [pc.bold('Severity'), pc.bold('Rule ID'), pc.bold('Path'), pc.bold('Message')],
          colWidths: [12, 26, 22, 45],
          wordWrap: true,
        });

        violations.forEach((v) => {
          const severityTag = v.severity === 'error' ? pc.red('ERROR') : pc.yellow('WARN');
          table.push([severityTag, pc.cyan(v.ruleId), v.path || 'N/A', v.message]);
        });

        console.log(table.toString());
        process.exitCode = 1;
      }
    } catch (error: any) {
      console.error(`${pc.red('[ERROR]')} ${error.message}`);
      process.exitCode = 1;
    }
} else {
  console.error(`${pc.red('[ERROR]')} Usage: enterprise-dx-cli lint <specPath>`);
  process.exitCode = 1;
}





