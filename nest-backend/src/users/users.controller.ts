import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt'

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('/signup')
    async addUser(
        @Body('password') userPassword: string,
        @Body('username') userName: string,
    ) {
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(userPassword, saltOrRounds);
        const result = await this.usersService.registerUser(
            userName,
            hashedPassword,
        );
        if (result.success) {
            return {
                msg: 'User successfully registered',
                userName: result.username
            }
        }
        else {
            return {
                msg: "User already created",
                userName: result.username
            }
        }
    }
} 
