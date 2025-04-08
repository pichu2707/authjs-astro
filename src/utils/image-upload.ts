import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({
    
    cloud_name : import.meta.env.CLOUDINARY_CLOUD_NAME,
    api_key : import.meta.env.CLOUDINARY_API_KEY,
    api_scret : import.meta.env.CLOUDINARY_API_SECRET,
});

export class ImageUpload {
    
    static async upload( file: File ){

        const buffer = await file.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');
        const imageType = file.type.split('/')[1]; //image/png

        const resp = await cloudinary.uploader.upload(
            `data:${file.type};base64,${base64Image}`,
        );
        console.log(resp);

        return 'https://mi.sitio.web/abc.png';
    }


}
