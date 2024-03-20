const http = require("http");
const { findUser } = require("./dbfunction");

function getBodyFromStream(req) {
  return new Promise((resolve, reject) => {
    const data = [];
    req.on("data", (chunk) => {
      data.push(chunk);
    });
    req.on("end", () => {
      const body = Buffer.concat(data).toString();
      if (body) {
        // assuming that the body is a json object
        resolve(JSON.parse(body));
        return;
      }
      resolve({});
    });

    req.on("error", (err) => {
      reject(err);
    });
  });
}

function authenticate(req, res, next) {
  const { username, password } = req.headers;
  console.log("authenticate", req.headers);
  const user = findUser(username, password);
  if (!user) {
    res.statusCode = 401;
    res.end();
    return;
  }
  if (user.username !== username || user.password !== password) {
    res.statusCode = 401;
    res.end();
    return;
  }
  next(req, res);
}

function getBooks(req, res) {
  console.log("getBooks", req.body);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ books: [{ name: "Harry Potter" }] }));
}

function getAuthors(req, res) {
  console.log("getBooks", req.body);
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ authors: [{ name: "J.K. Rowling" }] }));
}

function addBooks(req, res,) {
  console.log("addBook", req.headers);
  res.setHeader("Content-Type", "application/json");
 res.end("Book added Successfully");

}

function deleteBooks(req, res) {
  console.log("addBook", req.body);
  res.setHeader("Content-Type", "application/json");
  res.end("Book deleted Succesfully");
}

const server = http.createServer(async (req, res) => {
  // getBodyFromStream(req, res, getBooks);
  try {
    const body = await getBodyFromStream(req);
    req.setHeaders = body;
    if ((req.url === "/books") & (req.method === "GET")) {
      authenticate(req, res, getBooks);
    } else if ((req.url === "/books") & (req.method === "POST")) {
      authenticate(req, res, addBooks);
    } else if ((req.url === "/books") & (req.method === "DELETE")) {
      deleteBooks(req, res);
    } else if ((req.url === "/books") & (req.method === "PUT")) {
      res.end("Book have been replaced Successfully");
    } else if ((req.url === "/books") & (req.method === "PATCH")) {
      res.end("Book Updated successfully");
    } else if ((req.url === "/authors") & (req.method === "GET")) {
      authenticate(req, res, getAuthors);
    } else if ((req.url === "/authors") & (req.method === "POST")) {
      res.end("Author added Succesfully");
    } else if ((req.url === "/authors") & (req.method === "DELETE")) {
      res.end("Author Deleleted");
    } else if ((req.url === "/authors") & (req.method === "PATCH")) {
      res.end("Author Updated successfully");
    } else if ((req.url === "/authors") & (req.method === "PUT")) {
      res.end("Author have been replaced Successfully");
    }
  } catch (error) {
    res.statusCode = 500;
    res.end(error.message);
  }
});

server.listen(3000, () => console.log("Server is listening on port 3000"));
