const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  console.log("TEST");
  
  const token = req.cookies.token; // Extract JWT from cookies

  console.log(req.cookies);

  console.log("Token extrait des cookies:", token);

  if (!token) {
    return res
      .status(403)
      .json({ message: "Un token est requis pour accéder à cette ressource." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token décodé:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Erreur lors de la validation du token:", error.message);
    return res.status(401).json({ message: "Token invalide." });
  }
};

module.exports = verifyToken;
