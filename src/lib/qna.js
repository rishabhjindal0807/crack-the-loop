// Parses a Q&A markdown file into { id, title, icon, tagline, resume, categories: [{ id, title, summary, items }] }.
//
// Format:
//   ---                         front matter (key: value)
//   ::: resume ... :::          optional "from your resume" block
//   # Category title {#id}      starts a category; text before the first ## is its summary
//   ## Question text [Level]    starts a question; everything until the next ##/# is the answer
// Lines inside ``` fences are never treated as headings.

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[`'"’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 70);

export function parseQna(md) {
  const lines = md.replace(/\r/g, '').split('\n');
  const meta = {};
  let i = 0;
  if (lines[0] === '---') {
    for (i = 1; i < lines.length && lines[i] !== '---'; i++) {
      const m = lines[i].match(/^(\w+):\s*(.*)$/);
      if (m) meta[m[1]] = m[2];
    }
    i++;
  }

  const categories = [];
  let resume = '';
  let cat = null;
  let item = null;
  let buf = [];
  let inFence = false;
  let inResume = false;

  const flush = () => {
    const text = buf.join('\n').trim();
    buf = [];
    if (item) item.a = text;
    else if (cat) cat.summary = text;
  };

  for (; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*```/.test(line)) inFence = !inFence;
    if (!inFence) {
      if (line.trim() === '::: resume') { inResume = true; continue; }
      if (inResume && line.trim() === ':::') { inResume = false; continue; }
      if (inResume) { resume += line + '\n'; continue; }
      const c = line.match(/^# (.+?)\s*(?:\{#([\w-]+)\})?\s*$/);
      if (c) {
        flush();
        item = null;
        cat = { id: c[2] || slug(c[1]), title: c[1], summary: '', items: [] };
        categories.push(cat);
        continue;
      }
      const q = line.match(/^## (.+?)\s*(?:\[([\w -]+)\])?\s*$/);
      if (q && cat) {
        flush();
        item = { id: `${cat.id}-${slug(q[1])}`, q: q[1], level: q[2] || 'Core', a: '' };
        cat.items.push(item);
        continue;
      }
    }
    buf.push(line);
  }
  flush();
  return { ...meta, resume: resume.trim(), categories };
}
