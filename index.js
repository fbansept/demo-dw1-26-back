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
  // categories.forEach(categorie => {
  //   categorie.forEach((urlImage) => {
  //     //traitement
  //   });
  // })

  //on vérifie qu'il n'y a pas d'URL identique dans le tableau
  for (let categorie of categories) {
    for (let urlImage of categorie.images) {
      //est ce que l'url envoyée est identique à l'url que l'on est en train de parcourir
      if (urlImage === req.body.urlImage) {
        //on met fin à la fonction en renvoyent un code CONFLIT
        return res.status(409).send();
      }
    }
  }

  categories[req.body.indexCategorie].images.push(req.body.urlImage);

  res.status(201).send();
});

app.post("/supprimer-image", (req, res) => {
  categories[req.body.indexCategorie].images.splice(req.body.indexImage, 1);

  res.status(200).send();
});

app.patch("/deplacement-image", (req, res) => {
  const indexCategorie = req.body.indexCategorie;
  const indexImage = req.body.indexImage;
  const haut = req.body.haut;

  const nouvelIndexCategorie = indexCategorie + (haut ? -1 : 1);

  //l'mage va etre deplacer dans une categorie inexistante 
  // (note : cela ne devrait pas arriver si l'utilisateur passe par notre application, 
  // mais il pourrait passer directement pas l'api : 
  // ce qui est une erreur qu'on ne traitera pas coté front)
  if(nouvelIndexCategorie < 0 || nouvelIndexCategorie >= categories.length) {
    return res.status(400).send();
  }

  const urlImage = categories[indexCategorie].images[indexImage];
  categories[nouvelIndexCategorie].images.push(urlImage);
  //on supprime l'image originale
  categories[indexCategorie].images.splice(indexImage, 1);

  res.status(200).send();
});

app.listen(7777, () =>
  console.log("Le serveur est démarré sur le port 7777 !!!!!!"),
);
