import { db } from "./db.function.js";

const behavior = {
	handleBooks: async (req, res) => {
		const reqUrl = new URL(req.url, `http://${req.headers.host}`);
		const parts = reqUrl.pathname.split("/");
		const id = parts[parts.length - 1];

		switch (req.method) {
			case "POST":
				if (req.url === "/books/author") {
					const book = req?.body;
					// console.log(book);

					const result = db.addBook(book);

					if (result.message !== "failed") {
						res.writeHead(201, { "Content-Type": "application/json" });
						res.write(JSON.stringify(result));
					} else {
						console.log(result.message);
						res.writeHead(400, { "Content-Type": "application/json" });
						res.write(JSON.stringify(result));
					}
				}
				res.end();
				break;
			case "GET":
				if (req.url === "/books") {
					res.writeHead(200, { "Content-Type": "application/json" });
					res.write(
						JSON.stringify({
							message: "Book List",
							data: db.getBooks(),
						})
					);
				} else {
					res.writeHead(404, { "Content-Type": "application/json" });
					res.write(
						JSON.stringify({
							message: `${req.url} not found!`,
						})
					);
				}
				res.end();
				break;
			case "PUT":
				if (id && parts[1] === "books" && parts.length === 3) {
					const savedBook = await db.getBook(id);
					const modifiedBook = req?.body;
					if (savedBook && modifiedBook) {
						try {
							const updatedBook = {
								...savedBook,
								...modifiedBook,
							};

							const result = await db.updateBook(updatedBook);
							res.writeHead(200, { "Content-Type": "application/json" });
							res.write(
								JSON.stringify({
									message: "Book Updated successfully",
									book: result,
								})
							);
						} catch (error) {
							console.log(error);
						}
					} else {
						res.writeHead(404, { "Content-Type": "application/json" });
						res.write(JSON.stringify({ message: `Book not Found!` }));
					}
				} else {
					res.writeHead(404, { "Content-Type": "application/json" });
					res.write(
						JSON.stringify({ message: `${reqUrl.pathname} not Found!` })
					);
				}
				res.end();
				break;
			case "DELETE":
				if (id && parts[1] === "books" && parts.length === 3) {
					const result = db.deleteBook(id);

					if (result === "success") {
						res.write(JSON.stringify({ message: result }));
					}
				}
				res.end();
				break;
			default:
				res.writeHead(404, { "Content-Type": "application/json" });
				res.write(JSON.stringify({ message: "Method Not Allowed!" }));
				break;
		}
	},

	handleAuthor: (req, res) => {
		switch (req.method) {
			case "POST":
				if (req.url === "/books/author") {
					const book = req?.body;
					// console.log(book);

					const result = db.addBook(book);

					if (result.message !== "failed") {
						res.writeHead(201, { "Content-Type": "application/json" });
						res.write(JSON.stringify(result));
					} else {
						console.log(result.message);
						res.writeHead(400, { "Content-Type": "application/json" });
						res.write(JSON.stringify(result));
					}
				}
				res.end();
				break;

			case "PUT":
				res.statusCode = 200; //204;
				res.write("You are using PUT METHOD on books/author");
				break;
			case "DELETE":
				res.statusCode = 200; //204;
				res.write("You are using DELETE METHOD books/author");
				break;
			default:
				res.statusCode = 405;
				res.write("Method not allowed");
				break;
		}
	},
};

export default behavior;
