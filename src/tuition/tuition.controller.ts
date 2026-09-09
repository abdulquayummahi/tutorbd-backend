// src/tuition/tuition.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Request } from 'express'; // 1. Import Request from express
// ... other imports ...

// 2. Define a custom interface telling TypeScript that req contains a user payload
interface RequestWithUser extends Request {
  user: { id: string; email: string; role: string };
}

@Controller('api/tuitions')
export class TuitionController {
  // 3. Apply the type to all your @Req() decorators (Examples below)

  @UseGuards(JwtAuthGuard)
  @Post()
  createPost(@Body() dto: CreateTuitionDto, @Req() req: RequestWithUser) {
    return this.tuitionService.createPost(dto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deletePost(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: RequestWithUser,
  ) {
    return this.tuitionService.deletePost(id, req.user.id);
  }

  // Apply @Req() req: RequestWithUser to the remaining routes (apply, updateStatus, updatePost)
}
