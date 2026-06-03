import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
interface JwtPayload {
    sub: string;
    authId: string;
    email: string;
}
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    private getJwtToken;
    register(dto: RegisterDto): Promise<{
        accessToken: string;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
    }>;
    validateUser(payload: JwtPayload): Promise<{
        id: string;
        authId: string;
        email: string;
    } | null>;
    getMe(userId: string): Promise<{
        id: string;
        created_at: Date | null;
        name: string;
        auth_id: string;
        email: string;
        avatar_url: string | null;
    } | null>;
}
export {};
