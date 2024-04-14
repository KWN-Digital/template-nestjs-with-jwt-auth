import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
// import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt.guard';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body()
    user: {
      email: string;
      password: string;
      firstname: string;
      lastname: string;
    },
  ): Promise<any> {
    return this.authService.register(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Body() user: { email: string; password: string }): any {
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getHello(@Request() req): string {
    return req.user;
  }
}
