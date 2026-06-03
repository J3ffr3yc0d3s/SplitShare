import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FriendsService } from './friends.service';
import { AddFriendDto } from './dto/add-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';

@UseGuards(JwtAuthGuard)
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  getAll(@Request() req: any) {
    return this.friendsService.getAll(req.user.id);
  }

  @Post()
  addFriend(@Request() req: any, @Body() dto: AddFriendDto) {
    return this.friendsService.addFriend(req.user.id, dto);
  }

  @Patch(':id')
  updateStatus(@Param('id') id: string, @Request() req: any, @Body() dto: UpdateFriendDto) {
    return this.friendsService.updateStatus(id, req.user.id, dto);
  }
}
