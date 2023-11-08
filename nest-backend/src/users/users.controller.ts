import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  SignUpCommand,
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  GetUserCommand,
  InitiateAuthCommand,
  AuthFlowType,
} from "@aws-sdk/client-cognito-identity-provider";
import * as bcrypt from 'bcrypt'
import { credentialInterface } from './interfaces/credentials.interface';
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { formToJSON } from 'axios';

// Verifier that expects valid access tokens:
const verifier = CognitoJwtVerifier.create({
  userPoolId: "eu-north-1_bCStU3PvI",
  tokenUse: "access",
  clientId: "70mcdsr4svtmll851ehcccv7lj",
});

const cognito = new CognitoIdentityProviderClient({
    region: "eu-north-1",
});

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('/signup')
    async addUser(
        @Body() credentials: credentialInterface
    ) {
        const { email, username, password } = credentials
        const existingUser = await this.usersService.findOne(username)
        if (existingUser.success) {
            return {
                isError: true,
                message: "User Already Exists"
            }
        }
        const userData: {} = await new Promise(async (res, rej) => {
            try {
                const saltOrRounds = 10;
                const hashedPassword = await bcrypt.hash(password, saltOrRounds);
                const result = await this.usersService.registerUser(
                    email,
                    username,
                    hashedPassword,
                );
                res(result)
                await this.usersService.addUserCognito(username, password, email)
            } catch (error) {
                rej(error)
            }
        })
        return userData
    }

    @Post('/confirmation')
    async confirmUser( @Body('code') code: string, @Body('username') username: string) {
        const existingUser = await this.usersService.findOne(username)
        if (!existingUser.success) {
            return {
                isError: true,
                message: "User Doesn't Exist"
            }
        }
        return await this.usersService.confirmUserCognito(code, username)
    }

    @Post('/auth')
    async authUser( @Body('username') username: string, @Body('password') password: string) {
        return await this.usersService.authUser(username, password)
    }
} 
