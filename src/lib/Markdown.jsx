import { useMemo } from 'react';
import { dedent } from './dedent.js';
import { marked } from 'marked';
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

export const codeRenderer = {
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

function escape(s) {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}

export const proseClass =
  'prose prose-slate dark:prose-invert max-w-none prose-pre:p-0 prose-pre:bg-transparent prose-code:before:content-none prose-code:after:content-none prose-headings:font-semibold';

export default function Markdown({ children, className = '' }) {
  const html = useMemo(() => marked.parse(dedent(children || '')), [children]);
  return (
    <div
      className={`${proseClass} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export { dedent } from './dedent.js';
