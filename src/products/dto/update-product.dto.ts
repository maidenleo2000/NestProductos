import { PartialType } from '@nestjs/mapped-types'; //Hace opcionales los atributos y se heredan de CreateProductDTO
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
