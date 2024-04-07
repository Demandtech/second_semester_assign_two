import http from "http";
import behavior from "./behavior.js";

const getBody = (req) => {
	return new Promise((resolve, reject) => {
		const data = [];
		req.on("data", (chunk) => {
			data.push(chunk);
		});
		req.on("end", () => {
			const body = Buffer.concat(data).toString();
			if (body) {
				resolve(JSON.parse(body));
				return;
			}
			resolve({});
		});
		req.on("error", (error) => {
			reject(error);
		});
	});
};

const server = http.createServer(async (req, res) => {
	try {
		const body = await getBody(req);
		req.body = body;
		if (req.url.startsWith("/books")) {
			behavior.handleBooks(req, res);
		} else {
			res.writeHead(404, { "Content-Type": "application/json" });
			res.write(JSON.stringify({ message: "Not Found!" }));
			res.end();
		}
	} catch (error) {
		console.log(error);
		res.statusCode = 500;
		res.end(error.message);
	}
});

server.listen(8900, () => {
	console.log("Server is listening on port 8900");
});
