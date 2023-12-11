import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

export class TokenSender {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}
  public sendToken(user: User) {
    const accessToken = this.jwt.sign(
      {
        id: user.id,
      },
      {
        secret: this.config.get<string>('access_token_secret'),
      },
    );

    const refreshToken = this.jwt.sign(
      {
        id: user.id,
      },
      {
        secret: this.config.get<string>('refresh_token_secret'),
        expiresIn: '1d',
      },
    );

    return { user, accessToken, refreshToken };
  }
}
