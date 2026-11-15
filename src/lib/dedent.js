// Content is authored in indented template literals; strip the common indent.
export function dedent(str) {
  const lines = str.replace(/^\n/, '').split('\n');
  // If text starts on the same line as the opening backtick, ignore that line when measuring indent.
  const measured = str.startsWith('\n') ? lines : lines.slice(1);
  const indents = measured.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length);
  const min = indents.length ? Math.min(...indents) : 0;
  return lines.map((l, i) => (i === 0 && !str.startsWith('\n') ? l.trimStart() : l.slice(min))).join('\n').trimEnd();
}

