const express = require("express");
const cors = require("cors");
const app = express();
const mysql = require("mysql2");
const crypto = require("crypto");
const jwtUtils = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

// Configuration de la base de données
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "tier_list",
});

// Connexion à la base de données
connection.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données :", err);
    return;
  }
  console.log("Connecté à la base de données MySQL");
});

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

app.post("/login", (req, res) => {
  console.log(req.body.email, req.body.password);

  connection.query(
    "SELECT * FROM user WHERE email = ? AND password = ?",
    [req.body.email, req.body.password],
    (erreur, resultat) => {
      //ne devrait pas arriver,
      // a moins d'une erreur de syntaxe dans la requete,
      // ou si la bdd est down
      if (erreur) {
        return res.status(500).send();
      }

      //l'utilisateur s'est trompé de email / mdp
      if (resultat.length === 0) {
        return res.status(401).send();
      }

      const user = resultat[0];

      const jwt = jwtUtils.sign({ sub: req.body.email }, "mon-super-secret");

      res.send(jwt);

      //generation "a la main" d'un jwt
      // const header = {
      //   typ: "JWT",
      //   alg: "HS256",
      // };

      // const body = {
      //   sub: req.body.email,
      // };

      // const base64Header = Buffer.from(JSON.stringify(header)).toString(
      //   "base64url",
      // );
      // const base64Body = Buffer.from(JSON.stringify(body)).toString(
      //   "base64url",
      // );

      // const signature = crypto
      //   .createHmac("sha256", "mon-super-secret")
      //   .update(base64Header + "." + base64Body)
      //   .digest("base64url");

      // console.log(base64Header + "." + base64Body + "." + signature);
    },
  );
});

app.get("/categories", (req, res) => {
  const token = req.headers["authorization"];
  const jwt = token.substring(7);

  jwtUtils.verify(jwt, "mon-super-secret", (erreur, body) => {
    if (erreur) {
      return res.status(403).send();
    }

    //TODO : a remplacer par la requette : 
    // SELECT categorie_id, c.nom, i.id AS image_id, url
    // FROM user u 
    // JOIN categorie c ON u.id = c.user_id
    // JOIN image i ON c.id = i.categorie_id;

    res.json(categories);

  });

});

app.post("/ajout-image", (req, res) => {
  // categories.forEach(categorie => {
  //   categorie.forEach((urlImage) =>{} {
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
  if (nouvelIndexCategorie < 0 || nouvelIndexCategorie >= categories.length) {
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
