import { useMemo } from 'react';
import { dedent } from './dedent.js';
import { marked, Marked } from 'marked';
import markedKatex from 'marked-katex-extension';
import 'katex/dist/katex.min.css';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import sql from 'highlight.js/lib/languages/sql';
import yaml from 'highlight.js/lib/languages/yaml';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import dockerfile from 'highlight.js/lib/languages/dockerfile';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('jsx', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('tsx', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('py', python);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('json', json);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('dockerfile', dockerfile);

export { hljs };

const codeRenderer = {
  gfm: true,
  renderer: {
    code({ text, lang }) {
      const l = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
      const html = l === 'plaintext' ? escape(text) : hljs.highlight(text, { language: l }).value;
      return `<pre class="hljs-pre"><code class="hljs language-${l}">${html}</code></pre>`;
    },
  },
};
marked.use(codeRenderer);

// Separate instance with $inline$ / $$display$$ maths — only used where `math` is set,
// so dollar signs elsewhere (shell vars, prices) are left alone.
const mathMarked = new Marked(codeRenderer, markedKatex({ throwOnError: false, nonStandard: true }));

function escape(s) {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}

export default function Markdown({ children, className = '', math = false }) {
  const html = useMemo(() => (math ? mathMarked : marked).parse(dedent(children || '')), [children, math]);
  return (
    <div
      className={`prose prose-slate dark:prose-invert max-w-none prose-pre:p-0 prose-pre:bg-transparent prose-code:before:content-none prose-code:after:content-none ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export { dedent } from './dedent.js';
