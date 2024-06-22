import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto {

    @IsOptional()
    @IsPositive()
    @Type(() => Number ) //Lo convierte a un numero entero. En el ejercicio de pokemon se agrego el enableImplicitConversion: true en el app.module
    limit?: number;

    @IsOptional()
    @Min(0)
    @Type(() => Number ) 
    offset?: number;

}

