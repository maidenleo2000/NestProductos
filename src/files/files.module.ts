import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { FilesService } from './files.service';
import { FilesController } from './files.controller';
// import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [FilesController],
  // providers: [FilesService, ConfigService],
  providers: [FilesService],
  imports: [
    ConfigModule,
  ],
})
export class FilesModule {}
