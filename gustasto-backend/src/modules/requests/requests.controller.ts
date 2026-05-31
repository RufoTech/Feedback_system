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
import { RequestsService } from './requests.service';
import { R2UploadService } from './r2-upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('requests')
export class RequestsController {
  constructor(
    private readonly requestsService: RequestsService,
    private readonly r2UploadService: R2UploadService,
  ) {}

  // 1. Müştəri üçün: Müraciət yaradılması (Review, Suggestion, Complaint)
  // Şəkil yükləmək üçün FileInterceptor əlavə edirik (default memoryStorage istifadə olunur)
  @Post()
  @UseInterceptors(FileInterceptor('photo'))
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
      customerEmail?: string;
    },
    @UploadedFile() file: any,
  ) {
    const isAnon = body.isAnonymous === 'true' || (body.isAnonymous as any) === true;
    const ratingVal = body.rating ? parseInt(body.rating, 10) : 0;
    
    // Şəkil yüklənibsə Cloudflare R2-yə yükləyirik
    let photoUrl = '';
    if (file) {
      photoUrl = await this.r2UploadService.uploadFile(file);
    }

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
      customerEmail: body.customerEmail,
      photoUrl,
    });
  }

  // 2. Admin üçün: Müraciətlərin siyahısı (Auth tələb olunur)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getRequests(
    @Request() req: any,
    @Query('type') type?: string,
    @Query('startDate') startDate?: string,
    @Query('branchId') branchId?: string,
  ) {
    // Giriş edən admin-in aid olduğu restoranın müraciətlərini gətiririk
    const restaurantId = req.user.restaurantId?.toString();
    if (!restaurantId) {
      return []; // Əgər restorana bağlı deyilsə boş siyahı
    }
    return this.requestsService.findRequestsByRestaurant(restaurantId, { type, startDate, branchId });
  }

  // 3. Admin üçün: Analitika məlumatları (Auth tələb olunur)
  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getStats(
    @Request() req: any,
    @Query('branchId') branchId?: string,
  ) {
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
    return this.requestsService.getStats(restaurantId, branchId);
  }
}
