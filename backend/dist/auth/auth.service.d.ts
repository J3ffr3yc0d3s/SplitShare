import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
interface JwtPayload {
    sub: string;
    email: string;
}
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    private toPublicUser;
    private getJwtToken;
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string | null;
            createdAt: Date | null | undefined;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string | null;
            createdAt: Date | null | undefined;
        };
    }>;
    validateUser(payload: JwtPayload): Promise<{
        id: string;
        email: string;
        name: string;
        avatarUrl: string | null;
    } | null>;
    getMe(userId: string): Promise<{
        email: string;
        id: string;
        name: string;
        avatar_url: string | null;
        created_at: Date | null;
    } | null>;
}
export {};
