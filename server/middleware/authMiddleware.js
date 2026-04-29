middleware : 
module.exports = function tempAuth(req, res, next) {
  const userId =
    req.body?.userId || req.query?.userId || req.headers["x-user-id"];

  if (!userId) {
    return res.status(401).json({
      error: "Unauthorized. Send userId in body, query, or x-user-id header.",
    });
  }

  req.user = { id: String(userId) };
  next();
};