// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                host: config.get<string>('POSTGRES_HOST') ?? 'localhost',
                port: Number(config.get('POSTGRES_PORT')) || 5432,
                username: config.get<string>('POSTGRES_USER') ?? 'postgres',
                password: config.get<string>('POSTGRES_PASSWORD') ?? 'secret',
                database: config.get<string>('POSTGRES_DB') ?? 'mydb',
                autoLoadEntities: true,
                synchronize: true,
            }),
            inject: [ConfigService],
        }),

        MongooseModule.forRootAsync({
            useFactory: (config: ConfigService): any => ({
                uri: config.get<string>('MONGODB_URI') ?? 'mongodb://localhost:27017/mydb',
            }),
            inject: [ConfigService],
        }),
        UsersModule,
        ReviewsModule,
    ],
})
export class AppModule { }