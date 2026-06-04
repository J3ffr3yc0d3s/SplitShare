"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcryptjs_1 = require("bcryptjs");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    toPublicUser(user) {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            avatarUrl: user.avatar_url,
            createdAt: user.created_at,
        };
    }
    getJwtToken(user) {
        return {
            accessToken: this.jwtService.sign({
                sub: user.id,
                email: user.email,
            }),
            user: this.toPublicUser(user),
        };
    }
    async register(dto) {
        const existingUser = await this.prisma.users.findUnique({
            where: { email: dto.email },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('Email is already registered');
        }
        const passwordHash = await (0, bcryptjs_1.hash)(dto.password, 10);
        const user = await this.prisma.users.create({
            data: {
                email: dto.email,
                name: dto.name,
                password_hash: passwordHash,
            },
        });
        return this.getJwtToken(user);
    }
    async login(dto) {
        const user = await this.prisma.users.findUnique({
            where: { email: dto.email },
        });
        if (!user || !user.password_hash) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const isPasswordValid = await (0, bcryptjs_1.compare)(dto.password, user.password_hash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        return this.getJwtToken(user);
    }
    async validateUser(payload) {
        const user = await this.prisma.users.findUnique({
            where: { id: payload.sub },
        });
        if (!user) {
            return null;
        }
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            avatarUrl: user.avatar_url,
        };
    }
    async getMe(userId) {
        return this.prisma.users.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                avatar_url: true,
                created_at: true,
            },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map