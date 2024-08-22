

export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {
    // if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    //     return callback(new Error('Only image files are allowed!'), false);
    // }
    // console.log({file});

    if(!file) return callback( new Error('File is empty'), false );
    const fileExtension = file.mimetype.split('/')[1];
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    if(!validExtensions.includes(fileExtension)) return callback( new Error('Invalid file extension'), false ); // lo que hace esta linea es validar que sea una extension valida para poder subir la imagen

    callback(null, true);
}