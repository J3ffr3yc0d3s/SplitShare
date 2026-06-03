import { FriendsService } from './friends.service';
import { AddFriendDto } from './dto/add-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
export declare class FriendsController {
    private readonly friendsService;
    constructor(friendsService: FriendsService);
    getAll(req: any): Promise<{
        id: any;
        userId: any;
        friendId: any;
        email: any;
        name: any;
        avatar: any;
        addedAt: any;
        status: any;
    }[]>;
    addFriend(req: any, dto: AddFriendDto): Promise<{
        id: any;
        userId: any;
        friendId: any;
        email: any;
        name: any;
        avatar: any;
        addedAt: any;
        status: any;
    }>;
    updateStatus(id: string, req: any, dto: UpdateFriendDto): Promise<{
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
