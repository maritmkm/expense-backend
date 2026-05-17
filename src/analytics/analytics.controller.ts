import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetUser } from '../decorators/get-user.decorator';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get total income, expense and balance' })
  getSummary(@GetUser() user: any) {
    return this.analyticsService.getSummary(user.id);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get spending breakdown by category' })
  getByCategory(@GetUser() user: any) {
    return this.analyticsService.getByCategory(user.id);
  }

  @Get('monthly')
  @ApiOperation({ summary: 'Get monthly spending trends' })
  getMonthly(@GetUser() user: any) {
    return this.analyticsService.getMonthly(user.id);
  }
}
