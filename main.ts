// main.ts — the entrypoint of this make.fun bounty entry (Node 22, standard library only).
//
// What the house asks of this program, and nothing more: copy POST.json from the repository root to the output
// directory, so the sealed gate scorer can read the post's address. Nothing this program writes about the post is
// scored: the house reads the post itself from X, through FxTwitter's public read, and writes its own reading of the
// post's counts to <output>/post.counts.json after these runs.
//
// Two properties the grader leans on, so this file is deliberate about them:
//   1. Determinism. The grader runs the program twice and compares the bytes of what it wrote. The bytes written are
//      the bytes read, so two runs over the same repository produce identical files, and no timestamp, host name,
//      random value or ordering ever reaches the output.
//   2. No network, no clock, no path outside the repository. The only read is POST.json in the repository; the only
//      writes are inside the output directory.
//
// The address is validated before it is written, against the shapes the rules accept:
//   https://x.com/<handle>/status/<id>
//   https://twitter.com/<handle>/status/<id>
//   with an optional www. or mobile. host prefix, and /i/web/status/<id> in place of the handle form;
//   the id is digits only, and a query or fragment after it is read past.
// A file that does not hold such an address is refused with a message naming why, and exit status 1: shipping a
// POST.json the gate cannot read would be a silent zero, and a loud failure here is cheaper to fix.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const POST_FILE = 'POST.json';

/** A POST.json larger than this is not a post's address; refusing it keeps the run cheap and the message clear. */
const MAX_POST_BYTES = 64 * 1024;

/** The address forms the rules accept, as one anchored pattern: an X post, its id digits only. */
const POST_URL =
  /^https?:\/\/(?:www\.|mobile\.)?(?:x|twitter)\.com\/(?:[A-Za-z0-9_]{1,15}\/status|[iI]\/web\/status)\/(\d{1,25})(?:[?#].*)?$/;

type PostRead = { ok: true; bytes: Buffer } | { ok: false; message: string };

/**
 * Read POST.json and check it names one X post. Returns the exact bytes to write, so what is validated is what is
 * written: no re-serialization, no second read of the file, nothing that could differ between two runs.
 */
function readPostBytes(path: string): PostRead {
  let bytes: Buffer;
  try {
    bytes = readFileSync(path);
  } catch (err) {
    return { ok: false, message: `${path} could not be read: ${(err as Error).message}` };
  }

  if (bytes.byteLength > MAX_POST_BYTES) {
    return { ok: false, message: `${path} is ${bytes.byteLength} bytes, over the ${MAX_POST_BYTES}-byte limit` };
  }

  let text: string;
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return { ok: false, message: `${path} is not UTF-8 text` };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    return { ok: false, message: `${path} is not JSON: ${(err as Error).message}` };
  }

  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { ok: false, message: `${path} must hold a JSON object, as {"url": "https://x.com/<handle>/status/<id>"}` };
  }

  const url = (parsed as Record<string, unknown>).url;
  if (typeof url !== 'string') {
    return { ok: false, message: `${path} must hold a "url" string naming the post` };
  }
  if (!POST_URL.test(url)) {
    return {
      ok: false,
      message:
        `${path} does not name an X post: ${JSON.stringify(url)} ` +
        '(expected https://x.com/<handle>/status/<id>, the same on twitter.com, or /i/web/status/<id>)',
    };
  }

  return { ok: true, bytes };
}

function main(): number {
  const postPath = join(BOT_DIR, POST_FILE);

  const post = readPostBytes(postPath);
  if (!post.ok) {
    console.error(post.message);
    return 1;
  }

  try {
    mkdirSync(OUTPUT_DIR, { recursive: true });
    writeFileSync(join(OUTPUT_DIR, POST_FILE), post.bytes);
  } catch (err) {
    console.error(`${POST_FILE} could not be written to ${OUTPUT_DIR}: ${(err as Error).message}`);
    return 1;
  }

  return 0;
}

process.exitCode = main();
