import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as  path from 'path';
import { v4 as uuid } from 'uuid'
import { ResponseUploadDto } from './dto/response-upload.dto';
import { StorageUtils } from '@utils/storage.util';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {

    constructor(
        private readonly configService: ConfigService
    ) { }

    async storeToPublic(file: Express.Multer.File, dir: string[]): Promise<ResponseUploadDto> {

        this.validatePath(dir);

        const storage = StorageUtils.getPublicPath(true, dir.join('/'));
        const name = String(Date.now())

        const ext = path.extname(file.originalname.toLowerCase());
        const filename = name + ext

        const outputPath = path.join(storage, filename)


        fs.writeFileSync(outputPath, file.buffer);

        return {
            type: 'public',
            download: this.generateLink(dir, filename, 'public', { download: true }),
            link: this.generateLink(dir, filename, 'public'),
            path: this.generatePath(dir, filename, 'public')
        }
    }

    async storeToPrivate(file: Express.Multer.File, dir: string[], token: string): Promise<ResponseUploadDto> {

        this.validatePath(dir);

        const storage = StorageUtils.getPrivatePath(true, dir.join('/'));
        const name = String(Date.now())

        const ext = path.extname(file.originalname.toLowerCase());
        const filename = name + ext

        const outputPath = path.join(storage, filename)

        fs.writeFileSync(outputPath, file.buffer);

        return {
            type: 'private',
            download: this.generateLink(dir, filename, 'private', { download: true, token }),
            link: this.generateLink(dir, filename, 'private', { token }),
            path: this.generatePath(dir, filename, 'private')
        }
    }

    async deleteFile(pathDir: string[], type: "public" | "private") {

        this.validatePath(pathDir);

        const filePath = path.resolve(path.dirname(''), StorageUtils.getStoragePath(type, pathDir.join('/')))

        if (!fs.existsSync(filePath)) {
            throw new NotFoundException('File is not found')
        }

        fs.rmSync(filePath, { recursive: true });

    }

    private validatePath(path: string[]) {
        if (path.includes('..')) {
            throw new BadRequestException('Invalid path');
        }
    }

    generateLink(dir: string[], filename: string, type: 'private' | 'public', searchParams?: object) {

        const baseurl = this.configService.get('app.baseurl')

        const outDir = baseurl + `/upload/${type}/` + dir.join('/') + `/${filename}`;

        const url = new URL(outDir);

        searchParams && Object.keys(searchParams).forEach(key => {
            url.searchParams.append(key, searchParams[key])
        })

        return url.toString();
    }

    generatePath(dir: string[], filename: string, type: 'private' | 'public') {
        const outDir = `/upload/${type}/` + dir.join('/') + `/${filename}`;
        return outDir;
    }

    async moveFileOldToNew(oldPath: string, type: 'private' | 'public', newPath: string,) {

        this.validatePath(oldPath.split('/'));

        const filePath = path.resolve(path.dirname(''), StorageUtils.getStoragePath(type, oldPath))

        fs.renameSync(oldPath, filePath);
    }
}
