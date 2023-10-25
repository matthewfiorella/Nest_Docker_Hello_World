import { Injectable } from '@nestjs/common';
import { InputStrDTO } from './dto/input.dto';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { DynamoDBClient, QueryCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand, GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({region: "eu-north-1"});
const docClient = DynamoDBDocumentClient.from(client);

@Injectable()
export class PostalService {
    constructor(private readonly httpService: HttpService) {}

    async lookup(inputStrDTO: InputStrDTO): Promise<string> {
        const postalCode = inputStrDTO.input;
        try {
            const { data } = await firstValueFrom(
                this.httpService.get<string>('http://api.postcodes.io/postcodes/' + postalCode).pipe(
                    catchError((error: AxiosError) => {
                        throw "Error!";
                    }),
                ),
            );
            const trust = JSON.parse(JSON.stringify(data)).result.primary_care_trust
            return trust;
        }
        catch (err) {
            return "Not a Valid Postal Code!"
        }
    }

    async writeDB(healthTrust: string, inputStrDTO: InputStrDTO) {
        console.log("writing...")
        const command = new PutCommand({
            TableName: "History",
            Item: {
                UserId: "Placeholder",
                PostalCode: inputStrDTO.input,
                PrimaryHealthcareTrust: healthTrust,
                EntryTime: Date.now(),
            },
        });

        const response = await docClient.send(command)
        return response;
    }

    async readDB() {
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

        const response = await docClient.send(command);
        return response;
    }
}
