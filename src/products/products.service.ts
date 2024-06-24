import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as uuid } from 'uuid';
import { isUUID } from 'class-validator';
import { ProductImage } from './entities';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService'); //Logger para mostrar en consola.

  constructor(
    @InjectRepository(Product) //Aca se inyecta la entidad
    private readonly productsRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productsImageRepository: Repository<ProductImage>
  ) { }

  async create(createProductDto: CreateProductDto) {

    try {

      const {images = [], ...productDetails} = createProductDto;

      //TODO Toda esta validacion ahora la hago en la entity
      // if (!createProductDto.slug){
      //   createProductDto.slug = createProductDto.title.toLowerCase().replaceAll(' ','_').replaceAll("'",'');
      // }else{
      //   createProductDto.slug = createProductDto.slug.toLowerCase().replaceAll(' ','_').replaceAll("'",'');
      // }

      const product = this.productsRepository.create({
        ...productDetails,
        images: images.map(image => this.productsImageRepository.create({url: image})), //se crean las imagenes

      }); //Crea la instancia del producto.

      await this.productsRepository.save(product); //Aca se graba la instancia.

      // return product;
      return {...product, images};

    } catch (error) {

      this.handleDBExceptions(error);
    }


    // return 'This action adds a new product';
  }

  //TODO Paginar
  
  async findAll(paginationDto: PaginationDto) {
    // return `This action returns all products`;


    const { limit = 10, offset = 0 } = paginationDto;


    const products = await this.productsRepository.find({
      take: limit,
      skip: offset,
      //relaciones
      relations: {
        images: true,
      }
    });

    return products.map(product => ({ //de esta forma aplano la informacion de imagenes para que no se vea como un objeto sino como un array
      ...product,
      images: product.images.map(image => image.url)
    }))
  }

  async findOne(term: string) {
    // return `This action returns a #${id} product`;
    // console.log(term)
    let product: Product;

    if (isUUID(term)) {
      product = await this.productsRepository.findOneBy({ id: term });
    } else {
      //SIN USAR QUERY BUILDER
      // product = await this.productsRepository.findOneBy({slug: term});

      //USANDO QUERY BUILDER
      const queryBuilder = this.productsRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase()
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }


    //Buscar por ID
    // const product = await this.productsRepository.findOneBy({id});
    //Si existe lo muestra, sino lanza un error
    if (!product) {
      throw new NotFoundException(`Product with id ${term} not found`);
    }

    return product;

  }


  async findOnePlain(term: string) {
    const { images = [], ...product } = await this.findOne(term);
    return {
      ...product,
      images: images.map(image => image.url)
    }
  }




  async update(id: string, updateProductDto: UpdateProductDto) {
    // return `This action updates a #${id} product`;

    const product = await this.productsRepository.preload({
      //Aca se le dice a TypeORM que busque un producto por ID y luego coloque todas las propiedades del DTO (con ...updateProductDto)
      id: id,
      ...updateProductDto,
      images: [],
    });
    if (!product) throw new NotFoundException(`Product with id ${id} not found`);


    try {
      await this.productsRepository.save(product);
      return product;

    } catch (error) {
      this.handleDBExceptions(error);
    }


  }

  async remove(id: string) {
    // return `This action removes a #${id} product`;

    //Hago uso de la funcion findOne para buscar por ID y eliminarlo
    const product = await this.findOne(id);

    await this.productsRepository.remove(product);


  }


  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    // console.log(error);
    throw new InternalServerErrorException('Ayuda!!, check server logs');
  }
}
