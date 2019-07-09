const cluster = require('cluster');
const cpus = require('os').cpus().length;

if (cpus === 1) {
  return require('./worker.js');
}

if (cluster.isMaster) {
  console.log('Master', process.pid, 'launching workers');

  for (let i = 0; i < cpus; i++) {
  	cluster.fork();
  }

  cluster.on('exit', (worker, code, sig) =>
    console.log('Worker', worker.process.pid, 'died with signal', sig)
  );
} else {
  require('./worker.js');
}
