const { spawn } = require('child_process');

const proc = spawn('npx.cmd', ['vercel', 'login'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  shell: true,
});

let allOutput = '';
proc.stdout.on('data', d => { allOutput += d.toString(); process.stdout.write(d); });
proc.stderr.on('data', d => { allOutput += d.toString(); process.stderr.write(d); });

let step = 0;
const check = setInterval(() => {
  const lower = allOutput.toLowerCase();
  if (step === 0 && (lower.includes('email') || lower.includes('e-mail') || lower.includes('email?'))) {
    step = 1;
    proc.stdin.write('673019694@qq.com\n');
  } else if (step === 1 && lower.includes('password')) {
    step = 2;
    proc.stdin.write('Qq7758258.\n');
  }
}, 500);

proc.on('close', code => {
  clearInterval(check);
  console.log('\nExit code:', code);
  process.exit(code || 0);
});

setTimeout(() => { proc.kill(); clearInterval(check); process.exit(1); }, 45000);
