import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserWord } from 'src/user-word/entities/user-word.entity'; // ✅ importar UserWord


@Module({
  imports: [TypeOrmModule.forFeature([User, UserWord])], // ✅ añadir UserWord aquí
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // 👈 importante para que lo use el AuthModule
})
export class UsersModule {}
