import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  Request, 
  UseInterceptors, 
  UploadedFile, 
  HttpStatus, 
  HttpCode 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { RequestsService } from './requests.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import * as fs from 'fs';

// Disk yaddaşı konfiqurasiyası
const storageOptions = diskStorage({
  destination: (req: any, file: any, cb: any) => {
    const uploadPath = './uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req: any, file: any, cb: any) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
  },
});

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  // 1. Müştəri üçün: Müraciət yaradılması (Review, Suggestion, Complaint)
  // Şəkil yükləmək üçün FileInterceptor əlavə edirik
  @Post()
  @UseInterceptors(FileInterceptor('photo', { storage: storageOptions }))
  @HttpCode(HttpStatus.CREATED)
  async createRequest(
    @Body() body: {
      restaurantId: string;
      tableId: string;
      tableNumber: string;
      type: string;
      text: string;
      rating?: string; // body-dən string gələ bilər
      isAnonymous?: string;
      customerName?: string;
      customerPhone?: string;
    },
    @UploadedFile() file: any,
  ) {
    const isAnon = body.isAnonymous === 'true' || (body.isAnonymous as any) === true;
    const ratingVal = body.rating ? parseInt(body.rating, 10) : 0;
    
    // Şəkil yüklənibsə server linkini yaradırıq
    const photoUrl = file ? `http://localhost:3000/uploads/${file.filename}` : '';

    return this.requestsService.createRequest({
      restaurantId: body.restaurantId,
      tableId: body.tableId,
      tableNumber: body.tableNumber,
      type: body.type,
      text: body.text,
      rating: ratingVal,
      isAnonymous: isAnon,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      photoUrl,
    });
  }

  // 2. Admin üçün: Müraciətlərin siyahısı (Auth tələb olunur)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getRequests(
    @Request() req: any,
    @Query('type') type?: string,
    @Query('status') status?: string,
  ) {
    // Giriş edən admin-in aid olduğu restoranın müraciətlərini gətiririk
    const restaurantId = req.user.restaurantId?.toString();
    if (!restaurantId) {
      return []; // Əgər restorana bağlı deyilsə boş siyahı
    }
    return this.requestsService.findRequestsByRestaurant(restaurantId, { type, status });
  }

  // 3. Admin üçün: Analitika məlumatları (Auth tələb olunur)
  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getStats(@Request() req: any) {
    const restaurantId = req.user.restaurantId?.toString();
    if (!restaurantId) {
      return {
        totalRequests: 0,
        avgCsat: 5.0,
        typeDistribution: { service: 0, suggestions: 0, complaints: 0 },
        chartLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        chartData: [0, 0, 0, 0, 0, 0, 0],
        peakActivity: {
          service: { morning: 0, lunch: 0, dinner: 0 },
          feedback: { morning: 0, lunch: 0, dinner: 0 },
          payment: { morning: 0, lunch: 0, dinner: 0 },
        },
        topZones: [],
      };
    }
    return this.requestsService.getStats(restaurantId);
  }

  // 4. Admin üçün: Statusun dəyişdirilməsi (Auth tələb olunur)
  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.requestsService.updateStatus(id, status);
  }
}
