import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  try {
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // Inject Gemini API Key if available in environment
    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    
    // Replace the placeholder. We use a more specific pattern to avoid accidental matches.
    content = content.replace(/["']\/\* INJECT_API_KEY_HERE \*\/["']/g, `'${apiKey}'`);
    
    console.log(`[Static Server] Served index.html. Key present: ${apiKey.length > 0} (length: ${apiKey.length})`);
    res.send(content);
  } catch (error) {
    console.error('[Static Server] Error serving index.html:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Static server running at http://localhost:${port}`);
});
