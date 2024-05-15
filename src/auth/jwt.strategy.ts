import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { fetchConfig } from 'src/app.config';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: fetchConfig('app', 'jwt_secret'),
    });
  }

  async validate(payload: any): Promise<any> {
    const id: string = payload.sub;
    const user1 = await this.userService.findById(id);
    if (!user1) {
      throw new UnauthorizedException();
    }
    return user1;
  }
}
