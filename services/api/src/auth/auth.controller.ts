import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UseTwitchAuth, TwitchAuthResult } from '@nestjs-hybrid-auth/twitch'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseTwitchAuth()
    @Get()
    loginWithTwitch() {
        return this.authService.login()
    }
    
    @UseTwitchAuth()
    @Get('/callback')
    twitchCallback(@Request() req): Partial<TwitchAuthResult> {
        return this.authService.callback(req);
    }

}
