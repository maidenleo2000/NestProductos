import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';

import { fileFilter } from './helpers/fileFilter.helper';
import { fileNamer } from './helpers/fileNamer.helper';
import { ConfigService } from '@nestjs/config';


@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res:Response, //con este decorador Nest entiende que yo estoy mandando una respuesta y ya no la manda de forma automatica
    @Param('imageName') imageName: string
  ){

    const path = this.filesService.getStaticProductImage(imageName)
    // return path;

    // res.status(403).json({
    //   ok: false,
    //   path: path,
    // })
    
    res.sendFile(path); //si la imagen existe me la devuelve pero sin mostrar el path y si no existe me da un error
  }

  @Post('product')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits: { fieldSize: 1000 },
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }),  )
  uploadProductImage( 
    @UploadedFile() file: Express.Multer.File) {

    // console.log(file);
    // console.log({fileInController: file});

    if (!file) {
      throw new BadRequestException('File not found');
    }


    // const secureUrl = `${file.filename}`;
    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`; 
    return { secureUrl };

    // return {
    //   fileName: file.originalname
    // };
  }
}
