const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // Extract JWT from cookies

       

       

  if (!token) {
    return res
      .status(403)
      .json({ message: "Un token est requis pour accéder à cette ressource." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
         
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Erreur lors de la validation du token:", error.message);
    return res.status(401).json({ message: "Token invalide." });
  }
};

module.exports = verifyToken;
