import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TwitchAuthModule, TwitchAuthModuleOptions } from '@nestjs-hybrid-auth/twitch';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ChannelsModule } from './channels/channels.module';
import { VideosModule } from './videos/videos.module';
import { EchoModule } from './echo/echo.module';
import { AuthModule } from './auth/auth.module';

// Config
import databaseConfig from './config/database.config';
import twitchAuthConfig from './config/twitch.config';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [databaseConfig, twitchAuthConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => (configService.get<Object>('database')),
      inject: [ConfigService]
    }),
    TwitchAuthModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => (configService.get<TwitchAuthModuleOptions>('twitch')),
      inject: [ConfigService]
    }),
    UsersModule,
    ChannelsModule,
    VideosModule,
    EchoModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
