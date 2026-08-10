const { spawn } = require('child_process');
const surge = spawn('npx.cmd', ['surge', 'login'], { stdio: ['pipe', 'pipe', 'pipe'], shell: true });

let allOutput = '';
surge.stdout.on('data', d => { allOutput += d.toString(); process.stdout.write(d); });
surge.stderr.on('data', d => { allOutput += d.toString(); process.stderr.write(d); });

let step = 0;
const check = setInterval(() => {
  if (allOutput.includes('email') && step === 0) {
    step = 1;
    surge.stdin.write('673019694@qq.com\n');
  } else if (allOutput.includes('password') && step === 1) {
    step = 2;
    surge.stdin.write('Qq7758258.\n');
  }
}, 500);

surge.on('close', code => {
  clearInterval(check);
  console.log('\nExit code:', code);
  process.exit(code || 0);
});

setTimeout(() => { surge.kill(); clearInterval(check); process.exit(1); }, 25000);
