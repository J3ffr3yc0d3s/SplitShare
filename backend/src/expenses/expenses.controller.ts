import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@UseGuards(JwtAuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  getAll(@Request() req: any) {
    return this.expensesService.getAll(req.user.id);
  }

  @Get(':id')
  getById(@Param('id') id: string, @Request() req: any) {
    return this.expensesService.getById(id, req.user.id);
  }

  @Post()
  create(@Request() req: any, @Body() dto: CreateExpenseDto) {
    return this.expensesService.create(req.user.id, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Request() req: any, @Body() dto: UpdateExpenseDto) {
    return this.expensesService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req: any) {
    return this.expensesService.delete(id, req.user.id);
  }
}
