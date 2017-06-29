/*
	Cria um servidor web simples que envia os arquivos requisitados
*/

function createWebServer () {
	/** Importando módulos **/
	let fs = require('fs');		// File system - Contém métodos para manipulação de arquivos
	let http = require('http');	// http - Contém métodos para comunicação com o protocolo http

	// Callback que contém as instrução para quando o servidor receber um request
	function requestHandler (req, res) {
		// Imprimir quem fez o request e qual arquivo foi requisitado
		console.log('[' + req.connection.remoteAddress + '] : ' + req.url);
		// Código 200 no protocolo http = Ok
		res.writeHead(200);

		let requestedFile = req.url === '/'? 'index.html': req.url;
		fs.readFile('./public/' + requestedFile, (err, data) => { 
			if (err) {
				// Caso "Error NO ENTry", ocorre quando o arquivo não é encontrado
				if (err.code === 'ENOENT') {
					res.writeHead(404);
					res.end('Erro 404: File not found');
					return;
				}
				// Caso qualquer outro erro
				else {
					// Código 500 = erro interno no servidor
					res.writeHead(500);
					res.end('Erro: File could not be loaded!');
					return;
				}
			}
			// Caso não haja nenhum erro, termine a conexão enviando os dados do arquivo
			res.end(data);
		});
	}

	// Crie um servidor com o comportamento descrito acima e retorne ele
	return http.createServer(requestHandler);
}

// Quando esse módulo for requisitado pelo require(), retorne a função que constrói o web server
module.exports = createWebServer;