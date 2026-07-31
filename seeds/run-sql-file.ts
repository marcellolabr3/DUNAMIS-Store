import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const databaseName = 'dunamis-store-db';

export function runSqlFile(fileName: string) {
  const filePath = join(process.cwd(), 'seeds', fileName);

  if (!existsSync(filePath)) {
    throw new Error(`Seed file not found: ${filePath}`);
  }

  const executable = process.execPath;
  const wranglerEntryPoint = join(
    process.cwd(),
    'node_modules',
    'wrangler',
    'bin',
    'wrangler.js'
  );

  execFileSync(
    executable,
    [
      wranglerEntryPoint,
      'd1',
      'execute',
      databaseName,
      '--local',
      '--file',
      filePath
    ],
    {
      stdio: 'inherit'
    }
  );
}
