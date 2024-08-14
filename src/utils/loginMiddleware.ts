import { Request, Response, NextFunction, RequestHandler } from "express";
import { verifyJWT, generateJWT, decodeRefreshToken } from "./tokenHandler";
import UserModel, { IUser } from "../models/auth";

function superAdminLoginMiddleware(requiredRole: string): RequestHandler {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const cookies = req.headers.cookie
        ?.split(";")
        .map((cookie) => cookie.trim().split("="));
      const refreshTokenCookie = cookies?.find(
        (cookie) => cookie[0] === "refreshToken"
      );
      const refreshToken = refreshTokenCookie ? refreshTokenCookie[1] : null;

      if (!token && !refreshToken) {
        return res
          .status(401)
          .json({ error: "Authorization token is missing" });
      }

      const decodedToken: any = verifyJWT(token);

      const user = await UserModel.findById(decodedToken.userId);

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      if (user.role !== requiredRole) {
        return res.status(403).json({
          error: `Access denied. Only ${requiredRole}s can perform this action.`,
        });
      }

      req.user = user;

      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error });
    }
  };
}

function authMiddleware(): RequestHandler {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization?.split(" ")[1];
      const cookies = req.headers.cookie
        ?.split(";")
        .map((cookie) => cookie.trim().split("="));
      const refreshTokenCookie = cookies?.find(
        (cookie) => cookie[0] === "refreshToken"
      );
      const refreshToken = refreshTokenCookie ? refreshTokenCookie[1] : null;

      if (!accessToken && !refreshToken) {
        return res
          .status(401)
          .json({ error: "Authorization token is missing" });
      }

      let decodedToken: any;
      let user: IUser | null = null;

      if (accessToken) {
        try {
          decodedToken = verifyJWT(accessToken);
          user = await UserModel.findById(decodedToken.userId);
        } catch (accessTokenError) {
          console.error("Access token error:", accessTokenError);
          if (refreshToken) {
            try {
              const decodedRefreshToken: any = decodeRefreshToken(refreshToken);
              if (!decodedRefreshToken || !decodedRefreshToken.userId) {
                throw new Error("Invalid refresh token");
              }
              // Find user by ID from refresh token payload
              user = await UserModel.findById(decodedRefreshToken.userId);
              if (!user) {
                throw new Error("User not found");
              }
              // Generate new access token
              const newAccessToken = generateJWT(user._id);
              // Set the new access token in the request headers
              req.headers.authorization = `Bearer ${newAccessToken}`;
            } catch (refreshTokenError) {
              console.error("Refresh token error:", refreshTokenError);
              return res.status(401).json({ error: "Invalid refresh token" });
            }
          } else {
            return res.status(401).json({ error: "Access token is expired" });
          }
        }
      }
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      req.user = user;
      next();
    } catch (error: any) {
      console.error("Authentication error:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  };
}

export { superAdminLoginMiddleware, authMiddleware };
