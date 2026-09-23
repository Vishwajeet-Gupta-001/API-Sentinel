import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Invalid authentication format",
      });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.userId = decoded.userId;
    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

    next();
};

export { authMiddleware };