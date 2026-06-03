import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddFriendDto } from './dto/add-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';

@Injectable()
export class FriendsService {
  constructor(private readonly prisma: PrismaService) {}

  private mapFriendRequest(request: any, currentUserId: string) {
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

  private mapFriendship(friendship: any, currentUserId: string) {
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

  async getAll(userId: string) {
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

  async addFriend(userId: string, dto: AddFriendDto) {
    const friendUser = await this.prisma.users.findUnique({
      where: { email: dto.email },
    });

    if (!friendUser) {
      throw new NotFoundException('Friend user not found');
    }

    if (friendUser.id === userId) {
      throw new ConflictException('Cannot add yourself as a friend');
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
      throw new ConflictException('Friend request or friendship already exists');
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

  async updateStatus(id: string, userId: string, dto: UpdateFriendDto) {
    const request = await this.prisma.friend_requests.findUnique({
      where: { id },
      include: {
        users_friend_requests_sender_idTousers: true,
        users_friend_requests_receiver_idTousers: true,
      },
    });

    if (!request || (request.sender_id !== userId && request.receiver_id !== userId)) {
      throw new NotFoundException('Friend request not found');
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
}
