"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const mockPrisma = {
    users: {
        findUnique: jest.fn(),
        create: jest.fn(),
    },
    expenses: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
};
const mockJwtService = {
    sign: jest.fn(),
};
describe('AuthService', () => {
    let service;
    beforeEach(async () => {
        jest.clearAllMocks();
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                { provide: prisma_service_1.PrismaService, useValue: mockPrisma },
                { provide: jwt_1.JwtService, useValue: mockJwtService },
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
    });
    it('register() creates a user with correct fields and returns a JWT token', async () => {
        const dto = { authId: 'auth-1', email: 'user@example.com', name: 'User' };
        const createdUser = { id: '1', auth_id: dto.authId, email: dto.email };
        mockPrisma.users.create.mockResolvedValue(createdUser);
        mockJwtService.sign.mockReturnValue('jwt-token');
        const result = await service.register(dto);
        expect(mockPrisma.users.create).toHaveBeenCalledWith({
            data: {
                auth_id: dto.authId,
                email: dto.email,
                name: dto.name,
            },
        });
        expect(result).toEqual({ accessToken: 'jwt-token' });
    });
    it('login() throws UnauthorizedException when user not found', async () => {
        mockPrisma.users.findUnique.mockResolvedValue(null);
        await expect(service.login({ authId: 'unknown' })).rejects.toThrow(common_1.UnauthorizedException);
    });
    it('login() returns JWT when user exists', async () => {
        const user = { id: '1', auth_id: 'auth-2', email: 'user2@example.com' };
        mockPrisma.users.findUnique.mockResolvedValue(user);
        mockJwtService.sign.mockReturnValue('login-token');
        const result = await service.login({ authId: 'auth-2' });
        expect(result).toEqual({ accessToken: 'login-token' });
        expect(mockJwtService.sign).toHaveBeenCalledWith({
            sub: user.id,
            authId: user.auth_id,
            email: user.email,
        });
    });
    it('getMe() returns user without password field', async () => {
        const user = {
            id: '1',
            auth_id: 'auth-3',
            email: 'user3@example.com',
            name: 'User Three',
            avatar_url: 'avatar.png',
            created_at: new Date(),
        };
        mockPrisma.users.findUnique.mockResolvedValue(user);
        const result = await service.getMe(user.id);
        expect(mockPrisma.users.findUnique).toHaveBeenCalledWith({
            where: { id: user.id },
            select: {
                id: true,
                auth_id: true,
                email: true,
                name: true,
                avatar_url: true,
                created_at: true,
            },
        });
        expect(result).toEqual(user);
        expect(result).not.toHaveProperty('password');
    });
});
//# sourceMappingURL=auth.service.spec.js.map