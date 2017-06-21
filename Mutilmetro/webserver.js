function createWebServer () {
	let fs = require('fs');
	let http = require('http');

	function requestHandler (req, res) {
		console.log('[' + req.connection.remoteAddress + '] : ' + req.url);
		res.writeHead(200);

		let requestedFile = req.url === '/'? 'index.html': req.url;
		fs.readFile('./public/' + requestedFile, (err, data) => { 
			if (err) {
				if (err.code === 'ENOENT') {
					res.writeHead(404);
					res.end('Erro 404: File not found');
					return;
				}
				else {
					res.writeHead(500);
					res.end('Erro: File not loaded!');
					return;
				}
			}
			res.end(data);
		});
	}
	return http.createServer(requestHandler);
}

module.exports = createWebServer;