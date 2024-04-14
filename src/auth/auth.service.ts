import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findOne(email);
    if (!user || !user.id) return null;

    const { password } = user;
    const recentPassword = password.sort(
      (a: any, b: any) => a.createdAt - b.createdAt,
    )[0];

    const isValid = await bcrypt.compare(pass, recentPassword.hash);
    if (!isValid) return null;

    // remove password from user object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user;

    return result;
  }

  async login(existingUser: { email: string; password: string }) {
    const user = await this.usersService.findOne(existingUser.email);
    const payload = {
      aud: ['kwndigital', 'https://www.kwn.digital/userinfo/'],
      azp: 'kwndigital',
      scope: 'openid profile email address phone read:appointments',
      sub: user.id,
    };
    const access_token = this.jwtService.sign(payload);
    return this.usersService.createSession(user.id, access_token);
  }

  async register(user: {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
  }): Promise<{
    message: string;
    email: User['email'];
    id: User['id'];
  }> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    const newUser = await this.usersService.create({
      ...user,
      password: {
        hash,
        salt,
      },
    });

    return {
      message: 'User created successfully',
      email: newUser.email,
      id: newUser.id,
    };
  }
}
