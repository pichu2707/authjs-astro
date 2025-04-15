import { v2 as cloudinary } from 'cloudinary';



    // Configuration
    cloudinary.config({ 
        cloud_name: 'dgrfiq2y4', 
        api_key: '357732465226633', 
        api_secret: import.meta.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });
export class ImageUpload {
    
    static async upload( file: File ){

        const buffer = await file.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');
        const imageType = file.type.split('/')[1]; //image/png

        const resp = await cloudinary.uploader.upload(
            `data:image/${imageType};base64,${base64Image}`,
        );
        console.log(resp);

        return resp.secure_url;
    }

    static async delete( image:string ) {
        try {
        const imageName = image.split('/').pop() ?? '';
        const imageId = imageName.split('.')[0];

        const reps = await cloudinary.uploader.destroy(imageId);
            console.log('delete resp', reps);
        
        return true;
    } catch (error) {
        console.log('delete error', error);
        return false;    
        }
    }
}
