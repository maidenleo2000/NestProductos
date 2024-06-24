import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";



@Entity()
export class ProductImage {

    @PrimaryGeneratedColumn()
    id: number;


    @Column('text')
    url: string;


    //Esta es la relacion entre ProductImage y Product. Muchas imagenes pueden tener un producto
    @ManyToOne(
        //va a regresar un objeto de tipo Product
        () => Product,

        //para que me regrese el product
        (product) => product.images,
        {}

    )
    product: Product;

}