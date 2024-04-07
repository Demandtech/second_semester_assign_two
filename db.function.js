import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const data = JSON.parse(fs.readFileSync("./db.json", "utf8"));

const keysTypeToCheck = {
	id: "string",
	year: "number",
	name: "string",
	author: "string",
	author_id: "string",
};

function hasAllKeys(obj) {
	let result = {};

	for (let key in keysTypeToCheck) {
		result[key] = key in obj && typeof obj[key] === keysTypeToCheck[key];
	}

	return result;
}

export const db = {
	addBook: (book) => {
		try {
			if (book) {
				const bookToSave = {
					id: uuidv4(),
					...book,
				};
				const result = hasAllKeys(bookToSave);

				if (Object.values(result).every((value) => value)) {
					data.books.push(bookToSave);
					fs.writeFileSync("./db.json", JSON.stringify(data, null, 2));
					return {
						message: "Book added successfully",
						data: bookToSave,
					};
				} else {
					const errors = {};
					for (const key in result) {
						if (!result[key]) {
							errors[key] = `must be a ${typeof keysTypeToCheck[key]}`;
						}
					}
					return {
						message: "failed",
						data: errors,
					};
				}
			}
		} catch (error) {
			console.log(error);
		}
	},
	getBooks: () => {
		const { books } = data;
		return books;
	},
	getBook: (id) => {
		if (!id || typeof Number(id) !== "number") return;

		const { books } = data;

		const book = books.find((book) => {
			return book.id == id;
		});

		return book;
	},
	updateBook: (updateBook) => {
		const index = data?.books.findIndex((book) => book?.id === updateBook?.id);
		try {
			if (index !== -1) {
				data.books[index] = updateBook;
				fs.writeFileSync("./db.json", JSON.stringify(data, null, 2));

				return updateBook;
			} else {
				return null;
			}
		} catch (error) {
			console.error("Error updating book:", error);
		}
	},
	deleteBook: (id) => {
		console.log(data?.books.filter((book) => book?.id !== id));
		try {
			data.books = data?.books.filter((book) => book?.id !== Number(id));

			fs.writeFileSync("./db.json", JSON.stringify(data, null, 2));
			return "success";
		} catch (error) {
			console.error("Error deleting book:", error);
		}
	},
};
