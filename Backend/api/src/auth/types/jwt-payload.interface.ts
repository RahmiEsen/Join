export interface JwtPayload {
  sub: string;
  email: string;
  name?: string;
  role?: string;
  picture?: string | null;
}