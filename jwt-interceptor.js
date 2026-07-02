const jwtUtils = require("jsonwebtoken");
const connection = require("./connection");

function jwtInterceptor(req, res, next) {
  const token = req.headers["authorization"];
  const jwt = token.substring(7);

  jwtUtils.verify(jwt, "mon-super-secret", (erreur, body) => {
    if (erreur) {
      return res.status(403).send();
    }

    connection.query(
      `SELECT *
          FROM user u 
          WHERE u.email = ?`,
      [body.sub],
      (erreur, utilisateurs) => {
        //ne devrait pas arriver,
        // a moins d'une erreur de syntaxe dans la requete,
        // ou si la bdd est down
        if (erreur) {
          return res.status(500).send();
        }

        //si l'utilisateur a été supprimé entre
        // l'attribution du JWT et cette requete
        if (utilisateurs.length === 0) {
          return res.status(401).send();
        }

        console.log(utilisateurs[0]);

        //on ajoute l'utilisateur dans les propriété de la requete
        req.user = utilisateurs[0];

        next();
      },
    );
  });
}

module.exports = jwtInterceptor;
