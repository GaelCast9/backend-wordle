import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WordsModule } from './words/words.module';
import { UserWordModule } from './user-word/user-word.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Config primero para que esté disponible para todos
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'wordle_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserWordModule,
    UsersModule,
    AuthModule,
    WordsModule,
    UserWordModule,
  ],
})
export class AppModule {}
