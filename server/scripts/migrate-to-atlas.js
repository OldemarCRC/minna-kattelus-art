import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const { MONGODB_URI_LOCAL, MONGODB_URI_ATLAS } = process.env;
const BACKUP_DIR = path.resolve(__dirname, '..', 'mongo-backup');

function assertEnv() {
  const missing = [];
  if (!MONGODB_URI_LOCAL) missing.push('MONGODB_URI_LOCAL');
  if (!MONGODB_URI_ATLAS) missing.push('MONGODB_URI_ATLAS');
  if (missing.length) {
    throw new Error(`Missing required env vars in server/.env: ${missing.join(', ')}`);
  }
}

// spawn (not exec) passes the URI as a discrete argv entry instead of a shell-interpreted
// string, so special characters in the password can't break shell parsing and the URI
// never passes through a shell that might log the full command line.
function runMongodump(uri, outDir) {
  return new Promise((resolve, reject) => {
    const child = spawn('mongodump', ['--uri', uri, '--out', outDir]);

    let stderr = '';
    child.stdout.on('data', () => {});
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve(stderr);
      else reject(new Error(`mongodump exited with code ${code}\n${stderr}`));
    });
  });
}

// mongodump logs "done dumping db.collection (N documents)" per collection to stderr.
function parseSummary(log) {
  const pattern = /done dumping (\S+)\.(\S+) \((\d+) documents?\)/g;
  const results = [];
  let match;
  while ((match = pattern.exec(log)) !== null) {
    results.push({ database: match[1], collection: match[2], documents: Number(match[3]) });
  }
  return results;
}

async function main() {
  assertEnv();
  fs.mkdirSync(BACKUP_DIR, { recursive: true });

  console.log(`Dumping from MONGODB_URI_LOCAL into ${BACKUP_DIR} ...`);
  const log = await runMongodump(MONGODB_URI_LOCAL, BACKUP_DIR);

  const summary = parseSummary(log);

  if (summary.length === 0) {
    console.warn('No "done dumping" lines found in mongodump output. Raw log:');
    console.warn(log);
  } else {
    console.log('\n=== Dump summary ===');
    let total = 0;
    for (const { database, collection, documents } of summary) {
      console.log(`  ${database}.${collection}: ${documents} documents`);
      total += documents;
    }
    console.log(`  TOTAL: ${total} documents across ${summary.length} collection(s)`);
  }

  console.log(`\nDump saved to: ${BACKUP_DIR}`);
}

main().catch((err) => {
  console.error('Migration dump failed:', err.message);
  process.exit(1);
});
