import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CombinationModule } from './combination/combination.module';
import { DatabaseInitService } from './combination/database-init.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'demo',
      // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    CombinationModule
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseInitService],
})
export class AppModule { }