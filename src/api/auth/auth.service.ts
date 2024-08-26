import { Injectable } from '@nestjs/common';
@Injectable()
export class AuthService {
  constructor(private readonly sessionService: SessionService) {}
}
