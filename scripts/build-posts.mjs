import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const postsDir = path.join(root, 'posts');
const output = path.join(root, 'dist', 'posts.json');
const fields = new Set(['title', 'slug', 'date', 'read', 'excerpt']);

function parseFrontmatter(source, file) {
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/);
  if (!match) throw new Error(`${file}: missing opening/closing --- frontmatter`);
  const metadata = {};
  for (const line of match[1].split(/\r?\n/)) {
    const entry = line.match(/^([a-z]+):\s*(.*)$/);
    if (!entry || !fields.has(entry[1])) throw new Error(`${file}: invalid frontmatter line: ${line}`);
    try {
      metadata[entry[1]] = JSON.parse(entry[2]);
    } catch {
      throw new Error(`${file}: quote ${entry[1]} as a JSON/YAML string`);
    }
  }
  for (const key of fields) {
    if (typeof metadata[key] !== 'string' || !metadata[key].trim()) {
      throw new Error(`${file}: missing required field: ${key}`);
    }
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(metadata.slug)) {
    throw new Error(`${file}: slug must contain lowercase letters, numbers, and hyphens`);
  }
  return { metadata, body: source.slice(match[0].length).trim() };
}

const files = (await readdir(postsDir)).filter(file => file.endsWith('.md'));
if (!files.length) throw new Error(`No Markdown posts found in ${postsDir}`);
const posts = [];
const slugs = new Set();
for (const file of files) {
  const source = await readFile(path.join(postsDir, file), 'utf8');
  const { metadata, body } = parseFrontmatter(source, file);
  if (file !== `${metadata.slug}.md`) throw new Error(`${file}: filename must match slug (${metadata.slug}.md)`);
  if (slugs.has(metadata.slug)) throw new Error(`${file}: duplicate slug ${metadata.slug}`);
  slugs.add(metadata.slug);
  posts.push({ ...metadata, tags: [], content: body });
}
posts.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
await writeFile(output, `${JSON.stringify(posts, null, 2)}\n`);
const indexPath = path.join(root, 'dist', 'index.html');
let index = await readFile(indexPath, 'utf8');
for (const [file, attribute, pattern] of [
  ['app.js', 'src', /src="\/app\.js(?:\?[^\"]*)?"/],
  ['styles.css', 'href', /href="\/styles\.css(?:\?[^\"]*)?"/],
]) {
  const content = await readFile(path.join(root, 'dist', file));
  const version = createHash('sha256').update(content).digest('hex').slice(0, 12);
  index = index.replace(pattern, `${attribute}="/${file}?v=${version}"`);
}
await writeFile(indexPath, index);
console.log(`Built ${posts.length} Markdown posts and fingerprinted site assets`);
