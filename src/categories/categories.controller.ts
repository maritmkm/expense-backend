import { Controller, Get, Post, Patch, Delete, Body, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetUser } from '../decorators/get-user.decorator';

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new custom category' })
  create(@Body() createDto: any, @GetUser() user: any) {
    // Note: user.userId or user.id depending on your JwtStrategy
    return this.categoriesService.create(createDto, user.userId || user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all available categories' })
  findAll(@GetUser() user: any) {
    return this.categoriesService.findAll(user.userId || user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a custom category' })
  update(@Param('id') id: string, @Body() updateDto: any, @GetUser() user: any) {
    return this.categoriesService.update(id, updateDto, user.userId || user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a custom category' })
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.categoriesService.remove(id, user.userId || user.id);
  }
}
