import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BalancesService } from './balances.service';

@UseGuards(JwtAuthGuard)
@Controller('balances')
export class BalancesController {
  constructor(private readonly balancesService: BalancesService) {}

  @Get()
  async getBalances(
    @Request() req: any,
    @Query('userId') userId?: string,
    @Query('friendId') friendId?: string,
  ) {
    const currentUserId = req.user.id;

    if (userId && friendId) {
      return this.balancesService.getBalanceBetweenUsers(currentUserId, friendId);
    }

    return this.balancesService.getBalances(currentUserId);
  }

  @Get('total')
  getTotal(@Request() req: any) {
    return this.balancesService.getTotal(req.user.id);
  }
}
