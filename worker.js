const { createServer } = require('http');
const https = require('https');
const http = require('http');
const config = require('./config.json');

createServer()
  .on('request', (req, res) => {
    if (req.headers.authorization !== config.authKey) {
      res.writeHead(401, {
        'Content-Type': 'application/json'
      });
      res.end(JSON.stringify({
        status: 401,
        error: 'Authorization mismatch'
      }));
    }

    let url;
    let urlRaw = req.url.slice(6);
    if (decodeURIComponent(urlRaw) !== urlRaw) {
      urlRaw = decodeURIComponent(urlRaw);
    }

    try {
      url = new URL(urlRaw);
    } catch (e) {
      res.writeHead(400, {
      	'Content-Type': 'application/json'
      });
      res.end(JSON.stringify({
        status: 400,
        error: urlRaw ? 'invalid URL' : 'No image URL provided'
      }));
    }

    (url.protocol === 'https:' ? https : http).get(url, (incomingRes) => {
      if (incomingRes.headers['content-length']) {
        res.setHeader('Content-Length', incomingRes.headers['content-length']);
      }

      incomingRes.pipe(res);
    })
      .on('error', (error) => {
      	res.writeHead(500, {
      	  'Content-Type': 'application/json'
      	});
      	res.end(JSON.stringify({
      	  status: 500,
      	  error: error.message
      	}));
      });    
  })
  .listen(80, () =>
    console.log('Worker', process.pid, 'launched')
  );
