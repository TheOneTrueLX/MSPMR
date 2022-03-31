import { Injectable } from '@nestjs/common';
import { UseTwitchAuth, TwitchAuthResult } from '@nestjs-hybrid-auth/twitch'


@Injectable()
export class AuthService {
    login() {
        return 'Login with Twitch'
    }

    callback(req): Partial<TwitchAuthResult> {
        const result: TwitchAuthResult = req.hybridAuthResult;
        return {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            profile: result.profile,
        };
    }
}
