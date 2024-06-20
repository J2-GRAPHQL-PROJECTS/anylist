import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class HandlerErrorService {
  private readonly logger = new Logger('Hanler Error');
  handlerErrorException(error: any, message: string) {
    if (error.code === 'P2025') {
      throw new NotFoundException(message);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(`Please check server logs`);
  }
}
