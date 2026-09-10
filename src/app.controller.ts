// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class AppController {
  // Route: GET http://localhost:3001/api/health
  @Get('health')
  checkConnection() {
    return {
      status: 'success',
      message: 'TutorBD Backend is fully connected and running!',
      timestamp: new Date().toISOString(),
    };
  }
}
