import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const { MONGODB_URI_ATLAS } = process.env;
const BACKUP_DIR = path.resolve(__dirname, '..', 'mongo-backup');
// Point directly at the minna-art dump folder, not the mongo-backup root: this mongorestore
// version doesn't walk per-database subdirectories when --nsInclude is combined with a
// multi-database root (it logged "don't know what to do with subdirectory X, skipping" for
// every db folder, including minna-art, and restored 0 documents). Pointing at the db's own
// folder makes mongorestore infer the target database from the folder name ("minna-art").
const DUMP_DIR = path.join(BACKUP_DIR, 'minna-art');
const NS_INCLUDE = 'minna-art.*';

function assertEnv() {
  if (!MONGODB_URI_ATLAS) {
    throw new Error('Missing required env var in server/.env: MONGODB_URI_ATLAS');
  }
  if (!fs.existsSync(DUMP_DIR)) {
    throw new Error(`Expected dump at ${DUMP_DIR} - run migrate-to-atlas.js first`);
  }
}

// spawn (not exec) passes the URI as a discrete argv entry, same rationale as the dump script.
function runMongorestore(uri, dumpDir, nsInclude) {
  return new Promise((resolve, reject) => {
    const child = spawn('mongorestore', ['--uri', uri, '--nsInclude', nsInclude, dumpDir]);

    let stderr = '';
    child.stdout.on('data', () => {});
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve(stderr);
      else reject(new Error(`mongorestore exited with code ${code}\n${stderr}`));
    });
  });
}

// mongorestore logs "finished restoring db.collection (N documents, M failures)" to stderr.
function parseSummary(log) {
  const pattern = /finished restoring (\S+)\.(\S+) \((\d+) documents?,\s*(\d+) failures?\)/g;
  const results = [];
  let match;
  while ((match = pattern.exec(log)) !== null) {
    results.push({
      database: match[1],
      collection: match[2],
      documents: Number(match[3]),
      failures: Number(match[4]),
    });
  }
  return results;
}

// Expected counts come from the PASO 3 dump summary (minna-art only), to verify parity.
const EXPECTED = {
  'minna-art.artworks': 8,
  'minna-art.orders': 6,
  'minna-art.users': 2,
};

async function main() {
  assertEnv();

  console.log(`Restoring ${NS_INCLUDE} from ${DUMP_DIR} into MONGODB_URI_ATLAS ...`);
  const log = await runMongorestore(MONGODB_URI_ATLAS, DUMP_DIR, NS_INCLUDE);

  const summary = parseSummary(log);

  if (summary.length === 0) {
    console.warn('No "finished restoring" lines found in mongorestore output. Raw log:');
    console.warn(log);
    return;
  }

  console.log('\n=== Restore summary ===');
  let total = 0;
  let mismatches = 0;
  for (const { database, collection, documents, failures } of summary) {
    const key = `${database}.${collection}`;
    const expected = EXPECTED[key];
    const expectedNote =
      expected === undefined
        ? '(not in expected list)'
        : expected === documents
        ? 'matches PASO 3 dump'
        : `MISMATCH vs PASO 3 dump (expected ${expected})`;
    if (expected !== undefined && expected !== documents) mismatches++;
    console.log(`  ${key}: ${documents} documents, ${failures} failures - ${expectedNote}`);
    total += documents;
  }
  console.log(`  TOTAL: ${total} documents across ${summary.length} collection(s)`);

  if (mismatches > 0) {
    console.warn(`\nWARNING: ${mismatches} collection(s) do not match the PASO 3 dump counts. Review before trusting Atlas as source of truth.`);
  } else {
    console.log('\nAll restored counts match the PASO 3 dump summary.');
  }
}

main().catch((err) => {
  console.error('Migration restore failed:', err.message);
  process.exit(1);
});
