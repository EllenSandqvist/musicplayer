let http = require("http");
let fs = require("fs");
let url = require("url");

let songs = JSON.parse(fs.readFileSync("./data/songs.json", "utf-8"));
let homepage = fs.readFileSync("./pages/index.html", "utf-8");
let superpolka = fs.readFileSync("./songs/SuperPolka.mp3");

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

let songView = fs.readFile("./pages/songView.html", "utf-8", (error, data) => {
  if (error) {
    console.error(error);
  } else {
    songView = data;
  }
});

function htmlReplace(template, song) {
  let output = template;
  output = output.replace("{{%TITLE%}}", song.title);
  output = output.replace("{{%LYRICS%}}", song.lyrics);
  output = output.replace("{{%ARTIST%}}", song.artist);
  output = output.replace("{{%GENRE%}}", song.genre);
  output = output.replace("{{%DURATION%}}", song.duration);
  output = output.replace("{{%ID%}}", song.id);
  output = output.replace("{{%RELEASEYEAR%}}", song.releaseYear);
  output = output.replace("{{%PLAYCOUNT%}}", song.playCount);
  output = output.replace("{{%MUSICBY%}}", song.music);

  return output;
}

let server = http.createServer((request, response) => {
  let { query, pathname: path } = url.parse(request.url, true);

  if (path === "/" || path === "/home") {
    response.writeHead(200, { "Content-Type": "text/html" });
    response.write(homepage);
    response.end();
  } else if (path === "/songs") {
    if (!query.id) {
      let songHTML = songs.map((song) => {
        return htmlReplace(songView, song);
      });
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(homepage.replace("{{%CONTENT%}}", songHTML.join("")));
      response.end();
    } else {
      let song = songs.find((song) => song.id == query.id);
      let detailHtml = htmlReplace(detailView, song);
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(homepage.replace("{{%CONTENT%}}", detailHtml));
      response.end();
      // if (req.url === '/songs/SuperPolka.mp3')
    }
  } else if (path === "/hej.mp3") {
    response.writeHead(200, { "Content-Type": "audio/mpeg" });
    response.end(superpolka);
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

// + Klicka på ett song och detaljvyn med extra information skall visas.

// + List eller rutnätsvyn visar information som: Titel, kort brödtext (1-2 rader), datum
// skapad. Namn på den som skrivit.

// + Detaljvyn visar extra information som: hela Titeln, hela brödtext informationen.
