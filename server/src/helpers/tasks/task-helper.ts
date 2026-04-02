import { AuthRequest } from "../../middlewares/authMiddleware";

export function firstQueryString(value: unknown): string | undefined {
  if (Array.isArray(value)) return typeof value[0] === 'string' ? value[0] : undefined;
  return typeof value === 'string' ? value : undefined;
}

export function getParam(req: AuthRequest, key: string): string | undefined {
  const value = (req.params as Record<string, string | undefined>)[key];
  return typeof value === 'string' ? value : undefined;
}