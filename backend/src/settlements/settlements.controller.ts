import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SettlementsService } from './settlements.service';
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { UpdateSettlementDto } from './dto/update-settlement.dto';

@UseGuards(JwtAuthGuard)
@Controller('settlements')
export class SettlementsController {
  constructor(private readonly settlementsService: SettlementsService) {}

  @Get()
  getAll(@Request() req: any) {
    return this.settlementsService.getAll(req.user.id);
  }

  @Post()
  create(@Request() req: any, @Body() dto: CreateSettlementDto) {
    return this.settlementsService.create(req.user.id, dto);
  }

  @Patch(':id')
  updateStatus(@Param('id') id: string, @Request() req: any, @Body() dto: UpdateSettlementDto) {
    return this.settlementsService.updateStatus(id, req.user.id, dto);
  }
}
