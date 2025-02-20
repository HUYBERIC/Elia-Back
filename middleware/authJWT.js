const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  console.log(req.cookies);

  console.log("Token extracted from cookies:", token);

  if (!token) {
    return res
      .status(403)
      .json({ message: "A token is required to access this resource." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token décodé:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error while validating token:", error.message);
    return res.status(401).json({ message: "Token not valid." });
  }
};

module.exports = verifyToken;
