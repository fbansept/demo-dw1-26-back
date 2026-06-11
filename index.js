const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const categories = [
  {
    titre: "Top",
    images: [
      "https://s2.qwant.com/thumbr/474x355/f/8/8bf3a97316628bd2b5e0409c72e1905fe5baec7ea652561ef14c5ad12e5b4f/OIP.WeGrv59uizzc0w9OSWcqoQHaFj.jpg?u=https%3A%2F%2Ftse.mm.bing.net%2Fth%2Fid%2FOIP.WeGrv59uizzc0w9OSWcqoQHaFj%3Fpid%3DApi&q=0&b=1&p=0&a=0",
      "https://s1.qwant.com/thumbr/474x711/8/0/a390c721e382269510f800e2f87a537c3c20a73d0354cbd4e3c6897e036e43/OIP.4I59nh6DR1HTHY-fIxZ7YwHaLH.jpg?u=https%3A%2F%2Ftse.mm.bing.net%2Fth%2Fid%2FOIP.4I59nh6DR1HTHY-fIxZ7YwHaLH%3Fpid%3DApi&q=0&b=1&p=0&a=0",
    ],
  },
  {
    titre: "Moyen",
    images: [],
  },
  {
    titre: "Nul",
    images: [
      "https://s2.qwant.com/thumbr/474x239/6/f/6ac3b6e9cd6ca4e710e04fe8de7f6ed6aa93fe43a761386448b521ff563e4b/OIP.rVo4T8-DDWRQG9ayCcutMgHaDv.jpg?u=https%3A%2F%2Ftse.mm.bing.net%2Fth%2Fid%2FOIP.rVo4T8-DDWRQG9ayCcutMgHaDv%3Fpid%3DApi&q=0&b=1&p=0&a=0",
    ],
  },
];

app.get("/categories", (req, res) => {
  res.json(categories);
});

app.post("/ajout-image", (req, res) => {


  categories[req.body.indexCategorie].images.push(req.body.urlImage);

  res.status(201).send();
});

app.post("/supprimer-image", (req, res) => {

  categories[req.body.indexCategorie].images.splice(req.body.indexImage, 1);

  res.status(200).send();
});

app.listen(3000, () =>
  console.log("Le serveur est démarré sur le port 3000 !!!!!!"),
);
