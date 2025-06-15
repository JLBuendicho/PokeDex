import os from 'os';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getLocalIp = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
};

const ip = getLocalIp();
const port = 5079; // ASP.NET backend port
const envPath = path.join(__dirname, '.env');

const lines = fs.existsSync(envPath)
  ? fs.readFileSync(envPath, 'utf-8').split('\n')
  : [];

const filtered = lines.filter(line => !line.startsWith('VITE_API_BASE_URL='));
filtered.push(`VITE_API_BASE_URL=http://${ip}:${port}`);

fs.writeFileSync(envPath, filtered.join('\n'));

console.log(`✅ .env updated: VITE_API_BASE_URL=http://${ip}:${port}`);