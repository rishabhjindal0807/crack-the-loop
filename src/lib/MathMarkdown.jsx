import { useMemo } from 'react';
import { Marked } from 'marked';
import markedKatex from 'marked-katex-extension';
import 'katex/dist/katex.min.css';
import { codeRenderer, proseClass } from './Markdown.jsx';
import { dedent } from './dedent.js';

// Markdown with $inline$ / $$display$$ maths. Kept out of the shared Markdown component so KaTeX
// (and its fonts) only load on problem pages, and dollar signs elsewhere are left alone.
const mathMarked = new Marked(codeRenderer, markedKatex({ throwOnError: false, nonStandard: true }));

export default function MathMarkdown({ children, className = '' }) {
  const html = useMemo(() => mathMarked.parse(dedent(children || '')), [children]);
  return <div className={`${proseClass} ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
