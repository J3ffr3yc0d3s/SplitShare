import { PrismaService } from '../prisma/prisma.service';
import { AddFriendDto } from './dto/add-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
export declare class FriendsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private mapFriendRequest;
    private mapFriendship;
    getAll(userId: string): Promise<{
        id: any;
        userId: any;
        friendId: any;
        email: any;
        name: any;
        avatar: any;
        addedAt: any;
        status: any;
    }[]>;
    addFriend(userId: string, dto: AddFriendDto): Promise<{
        id: any;
        userId: any;
        friendId: any;
        email: any;
        name: any;
        avatar: any;
        addedAt: any;
        status: any;
    }>;
    updateStatus(id: string, userId: string, dto: UpdateFriendDto): Promise<{
        id: any;
        userId: any;
        friendId: any;
        email: any;
        name: any;
        avatar: any;
        addedAt: any;
        status: any;
    }>;
}
