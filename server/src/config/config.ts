export const isProd = process.env.NODE_ENV === "production";
export const PORT = process.env.PORT || 5000;
export const CLIENT_URL = process.env.CLIENT_URL;

export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

export const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax" as const,
  path: "/",
};
