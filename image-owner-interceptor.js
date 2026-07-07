//Attention ce middleware nécessite que jwtInterceptor est été appelé au préalable,
// pour que req possede la propriété "user"

const connection = require("./connection");

function imageOwnerInterceptor(req, res, next) {
  const idImage = parseInt(req.params.id, 10);

  //on verifie que le parametre est bien un nombre
  if (isNaN(idImage)) {
    return res.status(400).send();
  }

  //on verifie que l'utilisateur "connecté" est bien le proprietaire de la catégorie qui contien l'image
  connection.query(
    ` SELECT c.user_id, i.categorie_id
      FROM image i
      JOIN categorie c ON c.id = i.categorie_id
      WHERE i.id = ?
    `,
    [idImage],
    (erreur, resultat) => {
      if (erreur) {
        console.log(erreur)
        return res.status(500).send();
      }

      //si l'image a déjà été supprimé ou n'a jamais existé
      if (resultat.length === 0) {
        return res.status(404).send();
      }

      //est ce que l'utilisateur connecté n'est pas propriétaire de l'image
      if (req.user.id !== resultat[0].user_id) {
        return res.status(403).send();
      }

      req.idImage = idImage;
      req.idCategorie = resultat[0].categorie_id;

      next();
    },
  );
}

module.exports = imageOwnerInterceptor;
