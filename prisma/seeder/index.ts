// 1. WAJIB: Load .env paling atas sebelum import lainnya
import 'dotenv/config'; 

import * as bcrypt from 'bcrypt';
import { Logger } from "@nestjs/common";
import * as fs from 'fs';
import { join, resolve } from 'path';
// Pastikan path ini benar, jika generate default gunakan '@prisma/client'
import { PrismaClient } from '../generated/prisma/client'; 
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

class Seeder {
    private readonly logger = new Logger(Seeder.name);
    private prisma: PrismaClient;
    private pool: Pool;
    
    // Counter
    private errorCount = 0;
    private successCount = 0;

    constructor() {
        // 2. Setup Database Connection
        const connectionString = `postgresql://${encodeURIComponent(process.env.DB_USER!)}:${encodeURIComponent(process.env.DB_PASSWORD!)}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
        
        this.pool = new Pool({ 
            connectionString,
            max: Number(process.env.DB_POOL_LIMIT) || 10,
            idleTimeoutMillis: 60000,
        });

        const adapter = new PrismaPg(this.pool);

        this.prisma = new PrismaClient({
            log: [
                { emit: "event", level: "error" },
                { emit: "event", level: "info" },
                { emit: "event", level: "warn" },
            ],
            adapter
        });

        // Setup Logging Listeners
        this.registerListeners();
    }

    private registerListeners() {
        // @ts-ignore: Event type issues in Prisma specific versions
        this.prisma.$on('warn', (e: any) => this.logger.warn(e.message));
        // @ts-ignore
        this.prisma.$on('info', (e: any) => this.logger.log(e.message));
        // @ts-ignore
        this.prisma.$on('error', (e: any) => this.logger.error(e.message));
    }

    /**
     * Main execution method
     */
    async run() {
        this.logger.log("Starting seeding...");
        
        try {
            await this.prisma.$connect();

            // === URUTAN SEEDING ===
            // 3. Masukkan urutan table di sini (parent dulu, baru child)
            
            await this.seedUsers();
            
            // Tambahkan seed lain di sini:
            // await this.seedProducts();

        } catch (err: any) {
            this.logger.error(`Fatal Seeding Error: ${err.message}`);
            process.exit(1);
        } finally {
            this.logger.verbose(`Seeding finished. Success: ${this.successCount} | Errors: ${this.errorCount}`);
            // 4. Clean shutdown
            await this.prisma.$disconnect();
            await this.pool.end(); 
        }
    }

    // --- SEEDING LOGIC PER TABLE ---

    private async seedUsers() {
        await this.storeData('users', async () => {
            const users = this.importJsonFile('users.json');
            
            for (const userData of users) {
                // Cek jika user sudah ada untuk menghindari re-hash password yang berat
                const existing = await this.prisma.users.findUnique({ where: { email: userData.email }});
                
                // Hash hanya jika create baru atau password berubah (opsional logic)
                // Di sini kita hash ulang demi keamanan upsert
                const passwordHash = await bcrypt.hash(userData.password, 10);

                await this.prisma.users.upsert({
                    where: { email: userData.email },
                    update: {
                        name: userData.name,
                        gender: userData.gender,
                        password: passwordHash,
                        role: userData.role
                    },
                    create: {
                        email: userData.email,
                        name: userData.name,
                        gender: userData.gender,
                        password: passwordHash,
                        role: userData.role
                    }
                });
            }
        });
    }

    // --- HELPERS ---

    private async storeData(name: string, cb: () => Promise<void>) {
        try {
            await cb();
            this.successCount++;
            this.logger.log(`[${name}] | success`);
        } catch (error: any) {
            this.errorCount++;
            this.logger.error(`[${name}] | ${error.message}`);
        }
    }

    private importJsonFile(filePath: string): any[] {
        try {
            const fullPath = resolve(join(__dirname, 'data', filePath)); // Pastikan folder 'data' ada
            const fileContent = fs.readFileSync(fullPath, 'utf-8');
            return JSON.parse(fileContent);
        } catch (e: any) {
            this.logger.error(`Failed to load JSON: ${filePath} - ${e.message}`);
            throw e;
        }
    }
}

// 5. EKSEKUSI UTAMA (IIFE)
// Jangan jalankan logic di constructor!
(async () => {
    const seeder = new Seeder();
    await seeder.run();
})();