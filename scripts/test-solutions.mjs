// Runs EVERY approach of EVERY DSA problem against its test cases.
// Usage: npm test   (CI runs this before building)
import { topics } from '../src/data/dsa/index.js';
import { runTests } from '../src/lib/runner.js';
import { dedent } from '../src/lib/dedent.js';

let failed = 0, total = 0, problems = 0;
const seen = new Set();
for (const t of topics) {
  for (const q of t.questions) {
    problems++;
    const key = `${t.id}/${q.id}`;
    if (seen.has(key)) {
      console.log(`DUPLICATE id ${key}`);
      failed++;
    }
    seen.add(key);
    if (!q.tests?.length) {
      console.log(`(no tests) ${key}`);
      continue;
    }
    for (const ap of q.approaches) {
      const res = runTests(q, dedent(ap.code));
      for (const r of res) {
        total++;
        if (!r.ok) {
          failed++;
          console.log(`FAIL ${key} [${ap.name}] ${r.label}: got ${JSON.stringify(r.got)} expected ${JSON.stringify(r.expected)}`);
        }
      }
    }
  }
}
console.log(`\n${topics.length} topics, ${problems} problems, ${total} test runs, ${failed} failures`);
process.exit(failed ? 1 : 0);
