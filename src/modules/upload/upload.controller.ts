import { Controller, Delete, HttpCode, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UploadService } from './upload.service';
import { AuthGuard } from '@guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseUploadDto } from './dto/response-upload.dto';
import { BaseResponse } from '@models/response.model';
import { Token } from '@decorators/auth.decorator';
import { FileValidationPipe } from '@pipes/file-validation.pipe';

@Controller('upload')
export class UploadController {

    constructor(
        private readonly uploadService: UploadService
    ) { }

    @UseGuards(AuthGuard)
    @Post('private/*path')
    @UseInterceptors(FileInterceptor('file'))
    @HttpCode(201)
    async private(
        @UploadedFile(FileValidationPipe) file: Express.Multer.File,
        @Token() token: string,
        @Param('path') path: string[]
    ): Promise<BaseResponse<ResponseUploadDto>> {
        const result = await this.uploadService.storeToPrivate(file, path, token)
        return {
            data: result,
            message: 'success',
            status: true
        }
    }

    @UseGuards(AuthGuard)
    @Delete('private/*path')
    @UseInterceptors(FileInterceptor('file'))
    @HttpCode(200)
    async deletePrivate(
        @Param('path') path: string[]
    ): Promise<BaseResponse> {
        await this.uploadService.deleteFile(path, 'private')
        return {
            message: 'success',
            status: true
        }
    }

    @UseGuards(AuthGuard)
    @Post('public/*path')
    @HttpCode(201)
    @UseInterceptors(FileInterceptor('file'))
    async public(
        @UploadedFile(FileValidationPipe) file: Express.Multer.File,
        @Param('path') path: string[]
    ): Promise<BaseResponse<ResponseUploadDto>> {
        
        const result = await this.uploadService.storeToPublic(file, path)

        return {
            data: result,
            message: 'success',
            status: true
        }
    }


    @UseGuards(AuthGuard)
    @Delete('public/*path')
    @UseInterceptors(FileInterceptor('file'))
    @HttpCode(200)
    async deletePublic(
        @Param('path') path: string[]
    ): Promise<BaseResponse> {
        await this.uploadService.deleteFile(path, 'public')
        return {
            message: 'success',
            status: true
        }
    }
}
