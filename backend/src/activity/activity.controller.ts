import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ActivityService } from './activity.service';

@UseGuards(JwtAuthGuard)
@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  async getAll(@Request() req: any) {
    const activities = await this.activityService.getAll(req.user.id);
    return activities.map((activity) => ({
      ...activity,
      timestamp: activity.timestamp,
    }));
  }
}
