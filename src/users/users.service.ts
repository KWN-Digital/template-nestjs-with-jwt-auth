import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as moment from 'moment';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findById(id: User['id']): Promise<User | undefined> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async createSession(userId: User['id'], access_token) {
    const session = await this.prisma.session.create({
      data: {
        access_token,
        expires: moment().add('1 day').toISOString(),
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return {
      userId,
      expires: session.expires,
      access_token,
    };
  }

  async requestSession(userId) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        sessions: true,
      },
    });

    return user.sessions[user.sessions.length - 1];
  }

  async create(user: {
    email: string;
    password: {
      hash: string;
      salt: string;
    };
    firstname: string;
    lastname: string;
  }): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...user,
        password: [
          {
            ...user.password,
          },
        ],
      },
    });
  }
}
