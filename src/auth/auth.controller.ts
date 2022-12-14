import { Controller} from '@nestjs/common';
import { AuthService } from './auth.service';
import {UsersService} from '../users/users.service'

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

}
