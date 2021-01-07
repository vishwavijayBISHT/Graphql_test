const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const authHeader = req.get("Authrization");
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(" ")[1];
  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }
  let dtoken;
  try {
    dtoken = jwt.verify(token, "somesuperseqretkey");
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  if (!dtoken) {
    req.isAuth = false;
    return next();
  }
  req.isAuth = false;
  req.userId = dtoken.userId;
  return next();
};
