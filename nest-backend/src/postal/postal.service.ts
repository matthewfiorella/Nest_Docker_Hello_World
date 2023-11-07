import { Injectable } from '@nestjs/common';
import { InputStrDTO } from './dto/input.dto';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import * as log4js from "log4js";

var logger = log4js.getLogger("postal")
log4js.configure({ 
    appenders: { postal: { type: "file", filename: "postal.log" } },
    categories: { default: { appenders: ["postal"], level: "debug"}}
});
logger.level = "debug"
logger.debug("Postal Information Log")
// Move to separate file
const client = new DynamoDBClient({
                                    region: "eu-north-1", 
                                    endpoint: "http://dynamodb-local:8000/",
                                    credentials: {
                                        sessionToken: "token",
                                        accessKeyId: "id",
                                        secretAccessKey: "key",
                                    }
                                });
const docClient = DynamoDBDocumentClient.from(client);

@Injectable()
export class PostalService {
    constructor(private readonly httpService: HttpService) {}

    async lookup(inputStrDTO: InputStrDTO): Promise<string> {
        const postalCode = inputStrDTO.input;
        try {
            logger.debug("Retrieving health trust for postalcode: " + postalCode)
            const { data } = await firstValueFrom(
                this.httpService.get<string>('http://api.postcodes.io/postcodes/' + postalCode).pipe(
                    catchError((error: AxiosError) => {
                        logger.debug(error)
                        throw "Error!";
                    }),
                ),
            );
            const trust = JSON.parse(JSON.stringify(data)).result.primary_care_trust
            logger.debug("Retrieved Health Trust: "  + trust)
            return trust;
        }
        catch (err) {
            return "Not a Valid Postal Code!"
        }
    }

    async writeDB(healthTrust: string, inputStrDTO: InputStrDTO) {
        logger.debug("Writing postalcode " + inputStrDTO.input + " health trust " + healthTrust + " to database")
        const command = new PutCommand({
            TableName: "History",
            Item: {
                UserId: "Placeholder",
                PostalCode: inputStrDTO.input,
                PrimaryHealthcareTrust: healthTrust,
                EntryTime: Date.now(),
            },
        });
        logger.debug("Write Command: ")
        logger.debug(command)
        const response = await docClient.send(command)
        logger.debug("Database Response: ")
        logger.debug(response)
        return response;
    }

    async readDB() {
        logger.debug("Reading last 5 postal codes inserted into database")
        const command = new QueryCommand({
            TableName: "History",
            KeyConditionExpression: "UserId = :id",
            ExpressionAttributeValues: {
                ":id": { S: "Placeholder" }
            },
            ScanIndexForward: false,
            Limit: 5,
            ProjectionExpression: "PostalCode, PrimaryHealthcareTrust, EntryTime"
        });
        logger.debug("Read Command: ")
        logger.debug(command)
        const response = await docClient.send(command);
        logger.debug("Database Response: ")
        logger.debug(response)
        return response;
    }
}
