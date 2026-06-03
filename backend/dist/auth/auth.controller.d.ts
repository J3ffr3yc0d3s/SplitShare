import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
    }>;
    me(req: any): Promise<{
        id: string;
        created_at: Date | null;
        name: string;
        auth_id: string;
        email: string;
        avatar_url: string | null;
    } | null>;
}
