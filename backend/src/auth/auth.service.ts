import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

interface JwtPayload {
  sub: string;
  authId: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtToken(user: { id: string; auth_id: string; email: string }) {
    return {
      accessToken: this.jwtService.sign({
        sub: user.id,
        authId: user.auth_id,
        email: user.email,
      }),
    };
  }

  async register(dto: RegisterDto) {
    const user = await this.prisma.users.create({
      data: {
        auth_id: dto.authId,
        email: dto.email,
        name: dto.name,
      },
    });

    return this.getJwtToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.users.findUnique({
      where: { auth_id: dto.authId },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.getJwtToken(user);
  }

  async validateUser(payload: JwtPayload) {
    const user = await this.prisma.users.findUnique({
      where: { auth_id: payload.authId },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      authId: user.auth_id,
      email: user.email,
    };
  }

  async getMe(userId: string) {
    return this.prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        auth_id: true,
        email: true,
        name: true,
        avatar_url: true,
        created_at: true,
      },
    });
  }
}
