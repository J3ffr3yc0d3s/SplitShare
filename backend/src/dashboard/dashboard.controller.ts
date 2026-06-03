import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metrics')
  getMetrics(@Request() req: any) {
    return this.dashboardService.getMetrics(req.user.id);
  }

  @Get('metrics/monthly-trend')
  getMonthlyTrend(@Request() req: any) {
    return this.dashboardService.getMonthlyTrend(req.user.id);
  }

  @Get('metrics/category-breakdown')
  getCategoryBreakdown(@Request() req: any) {
    return this.dashboardService.getCategoryBreakdown(req.user.id);
  }
}
