import { Injectable } from '@nestjs/common';
import { InputStrDTO } from './dto/input.dto';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
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
}
