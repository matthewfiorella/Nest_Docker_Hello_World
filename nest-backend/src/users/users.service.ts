import { Injectable } from '@nestjs/common';
import { docClient } from '../postal/postal.service'
import { DynamoDBClient, QueryCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand, GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { ConfirmSignUpCommand, CognitoIdentityProviderClient, InitiateAuthCommand, SignUpCommand, AuthFlowType } from '@aws-sdk/client-cognito-identity-provider';
import * as uuid from 'uuid';
import * as log4js from "log4js";
import { CognitoJwtVerifier } from "aws-jwt-verify";

// Verifier that expects valid access tokens:
const verifier = CognitoJwtVerifier.create({
  userPoolId: "eu-north-1_bCStU3PvI",
  tokenUse: "access",
  clientId: "70mcdsr4svtmll851ehcccv7lj",
});

const cognito = new CognitoIdentityProviderClient({
    region: "eu-north-1",
});

var logger = log4js.getLogger("user")
log4js.configure({ 
    appenders: { user: { type: "file", filename: "user.log" } },
    categories: { default: { appenders: ["user"], level: "debug"}}
});
logger.level = "debug"
logger.debug("User Creation Information Log")
export type User = any

@Injectable()
export class UsersService {
    async findOne(username: String) {
        logger.debug("Finding user: " + username)
        const command = new GetCommand({
            TableName: "Users",
            Key: {
                Username: username
            }
        })
        try {
            const response = await docClient.send(command)
            logger.debug("Read successful")
            return {
                success: true,
                username: response.Item.Username,
                password: response.Item.Password,
            }
        } catch (err) {
            logger.debug(err)
            return {
                success: false,
                username: username,
                password: "N/A",
            }
        }
    }

    async registerUser(email: string, username: string, hashedPassword: string) {
        logger.debug("Creating user: " + username)
        const uid = uuid.v1()
        const command = new PutCommand({
            TableName: "Users",
            Item: {
                Id: uid,
                Username: username,
                Password: hashedPassword,
                Email: email
            },
            ConditionExpression: "attribute_not_exists(Username)",
        });
        logger.debug("Database Response: ");
        try {
            const response = await docClient.send(command);
            logger.debug(response);
            return {
                username: username,
                email: email,
                id: uid,
                success: true,
            };
        } catch (err) {
            logger.debug("User already exists!");
            return {
                username: username,
                success: false,
            };
        }
    }
    
    async addUserCognito(username: string, password: string, email: string) {
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
    }

    async confirmUserCognito(code: string, username: string) {
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

    async authUser(username: string, password: string) {
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
        try {
            const response = await cognito.send(command)
            await verifier.verify(
              response.AuthenticationResult.AccessToken // the JWT as string
            )
            return {
                success: true,
                tokens: response.AuthenticationResult
            }
        } 
        catch {
            return {
                success: false,
                tokens: null
            };
        }
    }
    
}
