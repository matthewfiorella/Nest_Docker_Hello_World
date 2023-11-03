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
                const params = {
                    ClientId: "70mcdsr4svtmll851ehcccv7lj",
                    Username: username,
                    Password: password,
                    UserAttributes: [
                        {
                            Name: "name",
                            Value: username,
                        },
                        {
                            Name: "email",
                            Value: email,
                        },
                        {
                            Name: "phone_number",
                            Value: "+16312455942",
                        },

                    ],
                };
                const command = new SignUpCommand(params);
                await cognito.send(command);
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
                message: "User Doesn't Exists"
            }
        }
        const commandConfirmSignUp = new ConfirmSignUpCommand({
            ClientId: "70mcdsr4svtmll851ehcccv7lj",
            ConfirmationCode: code,
            Username: username
          });
          await cognito.send(commandConfirmSignUp)
            .then((data) => {
              return data;
            })
            .catch((err) => {
              return err;
            });
          return {
              success: true,
              message: "User verified successfully",
           }
    }

    @Post('/auth')
    async authUser( @Body('username') username: string, @Body('password') password: string) {
        const authflow: AuthFlowType = "USER_PASSWORD_AUTH"
        const input = {
            "AuthFlow": authflow,
            "AuthParameters": {
                "USERNAME": username,
                "PASSWORD": password,
            },
            "ClientId": "70mcdsr4svtmll851ehcccv7lj",
        }
        const command = new InitiateAuthCommand(input)
        const response = await cognito.send(command)
        return {
            tokens: response.AuthenticationResult
        }
    }
} 
