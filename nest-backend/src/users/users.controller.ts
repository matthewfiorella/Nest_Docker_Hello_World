import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { auth } from "express-openid-connect";
import * as bcrypt from 'bcrypt'

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'a long, randomly-generated string stored in env',
    baseURL: 'http://localhost:3000',
    clientID: 'xBJKy9uWLyW9RzGDPH5WObRwTA89b8Zr',
    issuerBaseURL: 'https://dev-n764kbt0fxmhjepd.us.auth0.com'
  };

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
