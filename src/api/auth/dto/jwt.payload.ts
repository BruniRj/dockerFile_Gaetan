export class JwtPayload {

  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string) {
  }
}
