let http = require("http");
let fs = require("fs");
let url = require("url");

let notes = JSON.parse(fs.readFileSync("./data/notes.json", "utf-8"));
let homepage = fs.readFileSync("./pages/index.html", "utf-8");

let detailView = fs.readFile(
  "./pages/detailView.html",
  "utf8",
  (error, data) => {
    if (error) {
      console.log(error);
    } else {
      detailView = data;
    }
  }
);

let cardView = fs.readFile("./pages/cardView.html", "utf-8", (error, data) => {
  if (error) {
    console.error(error);
  } else {
    cardView = data;
  }
});

function htmlReplace(template, note, path) {
  let output = template;
  output = output.replace("{{%TITLE%}}", note.title);
  output = output.replace("{{%TEXT%}}", note.text);
  output = output.replace("{{%AUTHOR%}}", note.author);
  output = output.replace("{{%IMAGE%}}", note.image);
  output = output.replace("{{%DATE%}}", note.date);
  output = output.replace("{{%ID%}}", note.id);

  return output;
}

let server = http.createServer((request, response) => {
  let { query, pathname: path } = url.parse(request.url, true);

  if (path === "/" || path === "/home") {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write(homepage);
    response.end();
  } else if (path === "/notes") {
    if (!query.id) {
      let notesHtml = notes.map((note) => {
        return htmlReplace(cardView, note, path);
      });
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(homepage.replace("{{%CONTENT%}}", notesHtml.join("")));
      response.end();
    } else {
      let note = notes[query.id];
      let detailHtml = htmlReplace(detailView, note);
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(homepage.replace("{{%CONTENT%}}", detailHtml));
      response.end();
    }
  } else {
    response.writeHead(404, { "Content-Type": "text/html" });
    response.end("page not found");
  }
});

server.listen(8200, "localhost", () => {
  console.log("server started");
  console.log("localhost:8200");
});

// Simple Notes

// Krav: skall minst ha.

// + ”Json” objekt för informationen/”data”:n.

// + 10 olika notes. Default är att alla notes visas/listas i vyn. En ”Tumbnail”-vy av
// notes i en list eller rutnäts vy.

// + Klicka på ett note och detaljvyn med extra information skall visas.

// + List eller rutnätsvyn visar information som: Titel, kort brödtext (1-2 rader), datum
// skapad. Namn på den som skrivit.

// + Detaljvyn visar extra information som: hela Titeln, hela brödtext informationen.
