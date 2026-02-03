import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ExceptionFilter,
    HttpException,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma';


/**
 * 
 * Configuartion error response
 * you can catch exception here
 */
@Catch(
    Error,
    BadRequestException,
    NotFoundException,
    UnauthorizedException,
)
export class ErrorFilter implements ExceptionFilter {

    private readonly logger = new Logger(ErrorFilter.name)
    catch(exception: any, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse();        
        if (exception instanceof BadRequestException) {
            response.status(exception.getStatus()).json({
                errors: [...(Array.isArray(exception.cause) ? exception.cause : [exception.message]) as string[]],
                status: false
            });
        } else if (exception instanceof UnauthorizedException) {
            response.status(exception.getStatus()).json({
                errors: [exception.message],
                status: false
            });
        } else if (exception instanceof NotFoundException) {
            response.status(exception.getStatus()).json({
                errors: [exception.message],
                status: false
            });
        } else if (exception instanceof HttpException) {
            response.status(exception.getStatus()).json({
                errors: [exception.message],
                status: false
            });
        } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
            this.logger.error(`[${exception.code}] ${exception.message}`);
            switch (exception.code) {
                case 'P2002':
                    response.status(400).json({
                        errors: ['Unique constraint failed'],
                        status: false
                    });
                    break;
                case 'P2025':
                    response.status(404).json({
                        errors: ['Record not found'],
                        status: false
                    });
                    break;
                default:
                    response.status(500).json({
                        errors: ['entity error'],
                        status: false
                    });
                    this.logger.error(`[${exception.code}] ${exception.message}`);
                    break;
            }
        } else {
            response.status(500).json({
                errors: ["internal server error"],
                status: false
            });
            this.logger.error(`[${exception.name}] ${exception.message}`);
        }
    }

}
