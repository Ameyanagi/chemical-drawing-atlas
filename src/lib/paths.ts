import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const versions = new Map<string, string>();

// Files in public/ (read relative to the build's working directory) carry a content hash, so a replaced image is fetched again instead of read from a browser cache.
function version(path: string) {
  let value = versions.get(path);
  if (value === undefined) {
    const file = join('public', path);
    value = /\.\w+$/.test(path) && existsSync(file) ? `?v=${createHash('sha256').update(readFileSync(file)).digest('hex').slice(0, 10)}` : '';
    versions.set(path, value);
  }
  return value;
}

export const href = (path = '') => {
  const clean = path.replace(/^\//, '');
  return `${base}/${clean}${version(clean)}`;
};
