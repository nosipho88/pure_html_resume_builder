const { exec } = require('child_process');
const url = 'http://localhost:8000';
let cmd;
if (process.platform === 'win32') cmd = `start "" "${url}"`;
else if (process.platform === 'darwin') cmd = `open "${url}"`;
else cmd = `xdg-open "${url}"`;
exec(cmd, (err) => {
  if (err) console.error('Failed to open browser:', err);
  // Keep process alive briefly so VS Code can show activity
  setTimeout(() => process.exit(0), 500);
});
