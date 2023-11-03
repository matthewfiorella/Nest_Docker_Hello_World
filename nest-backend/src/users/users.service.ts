import { Injectable } from '@nestjs/common';
import { docClient } from '../postal/postal.service'
import { DynamoDBClient, QueryCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand, GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import * as uuid from 'uuid';
import * as log4js from "log4js";

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
}
