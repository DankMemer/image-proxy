const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  console.log('Master', process.pid, 'launching workers');

  for (let i = 0; i <= os.cpus().length; i++) {
  	cluster.fork();
  }

  cluster.on('exit', (worker, code, sig) =>
    console.log('Worker', worker.process.pid, 'died with signal', sig)
  );
} else {
  require('./worker.js');
}
