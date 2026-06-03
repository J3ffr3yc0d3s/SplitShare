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
exports.FriendsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FriendsService = class FriendsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    mapFriendRequest(request, currentUserId) {
        const isSender = request.sender_id === currentUserId;
        const other = isSender
            ? request.users_friend_requests_receiver_idTousers
            : request.users_friend_requests_sender_idTousers;
        return {
            id: request.id,
            userId: request.sender_id,
            friendId: request.receiver_id,
            email: other.email,
            name: other.name,
            avatar: other.avatar_url,
            addedAt: request.created_at,
            status: request.status,
        };
    }
    mapFriendship(friendship, currentUserId) {
        const isUserA = friendship.user_a_id === currentUserId;
        const other = isUserA
            ? friendship.users_friendships_user_b_idTousers
            : friendship.users_friendships_user_a_idTousers;
        return {
            id: friendship.id,
            userId: currentUserId,
            friendId: other.id,
            email: other.email,
            name: other.name,
            avatar: other.avatar_url,
            addedAt: friendship.created_at,
            status: 'accepted',
        };
    }
    async getAll(userId) {
        const requests = await this.prisma.friend_requests.findMany({
            where: {
                OR: [{ sender_id: userId }, { receiver_id: userId }],
            },
            include: {
                users_friend_requests_sender_idTousers: true,
                users_friend_requests_receiver_idTousers: true,
            },
            orderBy: { created_at: 'desc' },
        });
        const friendships = await this.prisma.friendships.findMany({
            where: {
                OR: [{ user_a_id: userId }, { user_b_id: userId }],
            },
            include: {
                users_friendships_user_a_idTousers: true,
                users_friendships_user_b_idTousers: true,
            },
            orderBy: { created_at: 'desc' },
        });
        return [
            ...requests.map((request) => this.mapFriendRequest(request, userId)),
            ...friendships.map((friendship) => this.mapFriendship(friendship, userId)),
        ].sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime());
    }
    async addFriend(userId, dto) {
        const friendUser = await this.prisma.users.findUnique({
            where: { email: dto.email },
        });
        if (!friendUser) {
            throw new common_1.NotFoundException('Friend user not found');
        }
        if (friendUser.id === userId) {
            throw new common_1.ConflictException('Cannot add yourself as a friend');
        }
        const existingRequest = await this.prisma.friend_requests.findFirst({
            where: {
                OR: [
                    { sender_id: userId, receiver_id: friendUser.id },
                    { sender_id: friendUser.id, receiver_id: userId },
                ],
            },
        });
        const existingFriendship = await this.prisma.friendships.findFirst({
            where: {
                OR: [
                    { user_a_id: userId, user_b_id: friendUser.id },
                    { user_a_id: friendUser.id, user_b_id: userId },
                ],
            },
        });
        if (existingRequest || existingFriendship) {
            throw new common_1.ConflictException('Friend request or friendship already exists');
        }
        const request = await this.prisma.friend_requests.create({
            data: {
                sender_id: userId,
                receiver_id: friendUser.id,
            },
            include: {
                users_friend_requests_sender_idTousers: true,
                users_friend_requests_receiver_idTousers: true,
            },
        });
        return this.mapFriendRequest(request, userId);
    }
    async updateStatus(id, userId, dto) {
        const request = await this.prisma.friend_requests.findUnique({
            where: { id },
            include: {
                users_friend_requests_sender_idTousers: true,
                users_friend_requests_receiver_idTousers: true,
            },
        });
        if (!request || (request.sender_id !== userId && request.receiver_id !== userId)) {
            throw new common_1.NotFoundException('Friend request not found');
        }
        const updated = await this.prisma.friend_requests.update({
            where: { id },
            data: {
                status: dto.status ?? request.status,
            },
            include: {
                users_friend_requests_sender_idTousers: true,
                users_friend_requests_receiver_idTousers: true,
            },
        });
        if (dto.status === 'accepted') {
            const friendA = updated.sender_id;
            const friendB = updated.receiver_id;
            const existingFriendship = await this.prisma.friendships.findFirst({
                where: {
                    OR: [
                        { user_a_id: friendA, user_b_id: friendB },
                        { user_a_id: friendB, user_b_id: friendA },
                    ],
                },
            });
            if (!existingFriendship) {
                await this.prisma.friendships.create({
                    data: {
                        user_a_id: friendA,
                        user_b_id: friendB,
                    },
                });
            }
        }
        return this.mapFriendRequest(updated, userId);
    }
};
exports.FriendsService = FriendsService;
exports.FriendsService = FriendsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FriendsService);
//# sourceMappingURL=friends.service.js.map