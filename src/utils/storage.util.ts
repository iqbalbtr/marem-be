import appConfig from '@config/app.config';
import storage from '@config/storage.config';
import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export class StorageUtils {

    private static readonly logger = new Logger(StorageUtils.name);

    private static get rootPath(): string {
        return path.resolve(storage().storage.root);
    }

    static getPublicPath(withCreateFolder: boolean, ...paths: string[]) {
        const fullPath = path.join(this.rootPath, 'public', ...paths);

        if (withCreateFolder) {
            const dirToCheck = path.extname(fullPath) ? path.dirname(fullPath) : fullPath;
            if (!fs.existsSync(dirToCheck)) {
                fs.mkdirSync(dirToCheck, { recursive: true });
            }
        }

        return fullPath;
    }

    static getPrivatePath(withCreateFolder: boolean, ...paths: string[]) {
        const fullPath = path.join(this.rootPath, 'private', ...paths);

        if (withCreateFolder) {
            const dirToCheck = path.extname(fullPath) ? path.dirname(fullPath) : fullPath;
            if (!fs.existsSync(dirToCheck)) {
                fs.mkdirSync(dirToCheck, { recursive: true });
            }
        }

        return fullPath;
    }

    static getStoragePath(...paths: string[]) {
        return path.join(this.rootPath, ...paths);
    }

    static deleteFileFromUrl(url: string) {
        try {
            const baseUrl = `${appConfig().app.baseurl}/upload`;
            if (!url.includes(baseUrl)) return;

            const splitArr = url.split(baseUrl);
            if (splitArr.length < 2) return;

            const rawUrl = splitArr[1];
            const decodedUrl = decodeURIComponent(rawUrl);
            const filePath = this.getStoragePath(decodedUrl);

            if (!filePath.startsWith(this.rootPath)) return;

            if (fs.existsSync(filePath)) {
                fs.rmSync(filePath, { force: true });
            }
        } catch (error) {
            this.logger.error(`Gagal delete file by URL: ${error.message}`);
        }
    }

    static deleteFileFromPath(targetPath: string | string[]) {
        try {
            const pathsToDelete = Array.isArray(targetPath) ? targetPath : [targetPath];

            pathsToDelete.forEach(p => {
                if (!p.includes('/upload')) return;

                const splitArr = p.split('/upload');
                if (splitArr.length < 2) return;

                const relativePath = decodeURIComponent(splitArr[1]);

                const fullPath = this.getStoragePath(relativePath);

                if (fullPath.startsWith(this.rootPath) && fs.existsSync(fullPath)) {
                    fs.rmSync(fullPath, { force: true });
                }
            });
        } catch (error) {
            this.logger.error(`Gagal delete file by Path: ${error.message}`);
        }
    }

    static moveFiles(sources: string[], destination: string = "saved", excludeStartPath?: string): string[] {
        const result: string[] = [];
        const destDir = this.getStoragePath(path.join('public', destination));

        let targets = sources;

        if (excludeStartPath) {
            const cleanExclude = excludeStartPath.startsWith('/') ? excludeStartPath : `/${excludeStartPath}`;
            const excludePrefix = `/upload${cleanExclude}`;

            result.push(...sources.filter(s => s.startsWith(excludePrefix)));
            targets = targets.filter(s => !s.startsWith(excludePrefix));
        }

        if (!fs.existsSync(destDir)) {
            try {
                fs.mkdirSync(destDir, { recursive: true });
            } catch (e) {
                this.logger.error(`Gagal buat folder tujuan: ${e.message}`);
                return result;
            }
        }

        targets.forEach(source => {
            try {
                if (!source.includes('/upload')) return;

                const splitArr = source.split(`/upload`);
                if (splitArr.length < 2) return;

                const rawUrl = decodeURIComponent(splitArr[1]);
                const sourcePath = this.getStoragePath(rawUrl);

                if (!sourcePath.startsWith(this.rootPath) || !fs.existsSync(sourcePath)) {
                    return;
                }

                const fileName = path.basename(sourcePath);
                const destPath = path.join(destDir, fileName);

                fs.renameSync(sourcePath, destPath);

                let normalizeDest = destination.startsWith('/') ? destination.slice(1) : destination;

                const encodedFileName = encodeURIComponent(fileName);

                result.push(`/upload/public/${normalizeDest}/${encodedFileName}`);

            } catch (error) {
                this.logger.error(`Gagal move file: ${error.message}`);
            }
        });

        return result;
    }

    static copyFiles(sources: string[], destination: string = "saved"): string[] {
        const result: string[] = [];
        const destDir = this.getStoragePath(path.join('public', destination));

        let targets = sources;

        if (!fs.existsSync(destDir)) {
            try {
                fs.mkdirSync(destDir, { recursive: true });
            } catch (e) {
                this.logger.error(`Gagal buat folder tujuan: ${e.message}`);
                return result;
            }
        }

        targets.forEach(source => {
            try {
                if (!source.includes('/upload')) return;

                const splitArr = source.split(`/upload`);
                if (splitArr.length < 2) return;

                const rawUrl = decodeURIComponent(splitArr[1]);
                const sourcePath = this.getStoragePath(rawUrl);

                if (!sourcePath.startsWith(this.rootPath) || !fs.existsSync(sourcePath)) {
                    return;
                }

                const fileName = path.basename(sourcePath);
                const destPath = path.join(destDir, fileName);

                fs.copyFileSync(sourcePath, destPath);

                let normalizeDest = destination.startsWith('/') ? destination.slice(1) : destination;

                const encodedFileName = encodeURIComponent(fileName);

                result.push(`/upload/public/${normalizeDest}/${encodedFileName}`);

            } catch (error) {
                this.logger.error(`Gagal move file: ${error.message}`);
            }
        });

        return result;
    }

    static filterExistingFiles(filePaths: string[], startPath: string): string[] {
        return filePaths.filter(fl => !fl.startsWith(startPath));
    }

    static compareFileLists(oldFiles: string[], newFiles: string[]): { toDelete: string[], toAdd: string[] } {
        const toDelete = oldFiles.filter(of => !newFiles.includes(of));
        const toAdd = newFiles.filter(nf => !oldFiles.includes(nf));

        if (toDelete.length > 0) {
            this.deleteFileFromPath(toDelete);
        }

        return { toDelete, toAdd };
    }

    static deleteFolder(folderPath: string) {
        try {
            if (folderPath.includes('..')) return;

            const fullPath = this.getStoragePath(folderPath);

            if (!fullPath.startsWith(this.rootPath)) return;

            if (fs.existsSync(fullPath)) {
                fs.rmSync(fullPath, { recursive: true, force: true });
            }
        } catch (error) {
            this.logger.error(`Gagal delete folder: ${error.message}`);
        }
    }
}