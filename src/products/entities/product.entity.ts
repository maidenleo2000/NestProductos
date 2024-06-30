//Entity es una clase que representa una tabla en la base de datos

import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";

@Entity({name: 'products'})
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    //Con los decoradores @Column se define una columna en la base de datos
    @Column('text', { unique: true }) //el unique en true es para que no hayan 2 productos con el mismo nombre
    title: string;

    @Column('float', { default: 0 })
    price: number;

    //Nullable es para que sea opcional
    @Column('text', { nullable: true })
    description: string;

    @Column('text', { unique: true })
    slug: string;
    

    @Column('int', { default: 0 })
    stock: number;


    @Column('text', { array: true })
    sizes: string[];

    @Column('text')
    gender: string;


    @Column('text', { array: true, default: [] })
    tags: string[];

    //images
    //Esta es la relacion entre Product y ProductImage. Un producto puede tener muchas imagenes
    @OneToMany(
        () => ProductImage, //va a regresar un ProductImage
        (productImage) => productImage.product,

        //Eager es para que se carguen las imagenes y cascade es para que se actualicen automaticamente
        { cascade: true, eager: true }
    )
    images?: ProductImage[];



    //Esto valida que venga el slug y sino crea uno a partir del titulo. Luego lo pasa a minusculas y reemplaza los espacios por _.
    @BeforeInsert()
    checkSlugInsert(){
        if(!this.slug){
            this.slug = this.title
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')
    }


    @BeforeUpdate()
    checkSlugUpdate(){
        if(!this.slug){
            this.slug = this.title
        }
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')
    }
    

}

