import { 
  Controller, Get, Post, Patch, Delete, Body, Param, UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BudgetsService } from './budgets.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetUser } from '../decorators/get-user.decorator';

@ApiTags('Budgets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('budgets')
export class BudgetsController {
  constructor(private budgetsService: BudgetsService) {}

  @Post()
  @ApiOperation({ summary: 'Set a new budget' })
  create(@Body() createDto: any, @GetUser() user: any) {
    return this.budgetsService.create(createDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user budgets' })
  findAll(@GetUser() user: any) {
    return this.budgetsService.findAll(user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a budget' })
  update(@Param('id') id: string, @Body() updateDto: any, @GetUser() user: any) {
    return this.budgetsService.update(id, updateDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a budget' })
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.budgetsService.remove(id, user.id);
  }
}
