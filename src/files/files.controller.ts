import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';


@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors( FileInterceptor('file', {fileFilter: fileFilter}),  )
  uploadProductImage( 
    @UploadedFile() file: Express.Multer.File) {

    // console.log(file);
    console.log({fileInController: file});

    if (!file) {
      throw new BadRequestException('File not found');
    }

    return {
      fileName: file.originalname
    };
  }
}
