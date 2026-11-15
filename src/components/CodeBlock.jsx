import { useMemo, useState } from 'react';
import { hljs, dedent } from '../lib/Markdown.jsx';

export default function CodeBlock({ code, lang = 'javascript' }) {
  const src = dedent(code);
  const html = useMemo(() => hljs.highlight(src, { language: lang }).value, [src, lang]);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(src);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* clipboard blocked */
    }
  };
  return (
    <div className="relative group">
      <button
        onClick={copy}
        className="absolute right-2 top-2 rounded-md bg-slate-700/80 px-2 py-1 text-xs text-slate-200 opacity-0 transition group-hover:opacity-100 hover:bg-slate-600"
      >
        {copied ? 'Copied ✓' : 'Copy'}
      </button>
      <pre className="hljs-pre">
        <code className={`hljs language-${lang}`} dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}
