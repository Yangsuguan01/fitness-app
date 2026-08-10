const { spawn } = require('child_process');
const path = require('path');

const proc = spawn('npx.cmd', ['vercel', '--yes', '--cwd', path.resolve(__dirname, 'vercel-project')], {
  stdio: ['pipe', 'pipe', 'pipe'],
  shell: true,
  env: { ...process.env }
});

let allOutput = '';
proc.stdout.on('data', d => { allOutput += d.toString(); process.stdout.write(d); });
proc.stderr.on('data', d => { allOutput += d.toString(); process.stderr.write(d); });

let emailSent = false;
let passwordSent = false;
const check = setInterval(() => {
  // Check for email prompt
  if (!emailSent && (allOutput.includes('email') || allOutput.includes('Email') || allOutput.includes('e-mail'))) {
    emailSent = true;
    proc.stdin.write('673019694@qq.com\n');
  }
  // Check for password prompt
  if (!passwordSent && (allOutput.includes('password') || allOutput.includes('Password'))) {
    passwordSent = true;
    proc.stdin.write('Qq7758258.\n');
  }
}, 500);

proc.on('close', code => {
  clearInterval(check);
  console.log('\nExit code:', code);
  process.exit(code || 0);
});

setTimeout(() => { proc.kill(); clearInterval(check); process.exit(1); }, 60000);
