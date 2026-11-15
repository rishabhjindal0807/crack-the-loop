import { parseQna } from '../lib/qna.js';
import uiMd from './content/ui.md?raw';
import aiMd from './content/agentic-ai.md?raw';
import backendMd from './content/backend.md?raw';

// To add your own questions, edit the .md files in src/data/content — see README for the format.
export const sections = [parseQna(uiMd), parseQna(aiMd), parseQna(backendMd)];
