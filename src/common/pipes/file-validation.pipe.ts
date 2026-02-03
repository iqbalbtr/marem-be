import * as sharp from 'sharp';
import storageConfig from "@config/storage.config";
import { ALLOWED_EXT } from "@constants/storage.constant";
import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { extname } from "path";

export class FileValidationPipe implements PipeTransform {

    private _extname_allowed: string[] = ALLOWED_EXT
    private isOptional;
    
    constructor(ext_allow?: string[], isOptional: boolean = false){
        if(ext_allow){
            this._extname_allowed = ext_allow
        }
        this.isOptional = isOptional;
    }

    
    transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
   
        if(this.isOptional && !value)
            return null

        if (!value) {
            throw new BadRequestException('File is required');
        }

        // Get the storage limits from the configuration
        const storageLimits = storageConfig().storage.limit;        

        if (!this._extname_allowed.includes(extname(value.originalname).toLowerCase())) {
            throw new BadRequestException('File extension not allowed');
        }

        // Validate file based on its MIME type
        if (value.mimetype.startsWith('image')) {
            this.sizeValidate(value.size, storageLimits.image);

            // Compress image if it is JPEG, PNG, or JPG
            if (['jpeg', 'png', 'jpg'].includes(value.mimetype.split('/')[1].toLocaleLowerCase())) {
                return this.reduceImageSize(value);
            }

            return value;
        } 
        else if (value.mimetype.startsWith('video')) {
            this.sizeValidate(value.size, storageLimits.video);
        } 
        else {
            this.sizeValidate(value.size, storageLimits.default);
        }

        return value;
    }

    /**
     * Validates the file size against the maximum allowed size.
     * Throws an error if the file exceeds the allowed limit.
     */
    sizeValidate(size: number, maxSize: number) {
        
        if (size > (maxSize * 1024 * 1024)) {
            throw new BadRequestException('File size exceeds the allowed limit');
        }
        return true;
    }

    /**
     * Reduces the size of an image file using Sharp.
     * Resizes without enlarging the image and compresses it with 90% quality.
     */
    async reduceImageSize(value: Express.Multer.File) {
        const ext = value.originalname.split('.').pop()?.toLocaleLowerCase() as keyof sharp.FormatEnum;

        const imgBuffer = await sharp(value.buffer)
            .resize({ withoutEnlargement: true }) // Resize without making the image bigger
            .toFormat(ext, { quality: 90 }) // Convert to the same format with 90% quality
            .toBuffer();

        // Replace the original buffer with the optimized image
        value.buffer = imgBuffer;

        return value;
    }
}
