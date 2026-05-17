import { 
  Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, 
  UseInterceptors, UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetUser } from '../decorators/get-user.decorator';
import { CreateExpenseDto } from './dto/create-expense.dto';

@ApiTags('Expenses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/expenses',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  create(
    @Body() createDto: CreateExpenseDto, 
    @GetUser() user: any,
    @UploadedFile() file: any
  ) {
    // If file uploaded, add the path to the DTO
    if (file) {
      createDto.attachment = `/uploads/expenses/${file.filename}`;
    }
    
    // Convert stringified numbers back to Number type
    if (typeof createDto.amount === 'string') {
      createDto.amount = Number(createDto.amount);
    }
    
    return this.expensesService.create(createDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all expenses with filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'type', required: false, enum: ['income', 'expense'] })
  findAll(@Query() query: any, @GetUser() user: any) {
    return this.expensesService.findAll(user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single expense by ID' })
  findOne(@Param('id') id: string, @GetUser() user: any) {
    return this.expensesService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an expense' })
  update(@Param('id') id: string, @Body() updateDto: any, @GetUser() user: any) {
    return this.expensesService.update(id, updateDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an expense' })
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.expensesService.remove(id, user.id);
  }
}
