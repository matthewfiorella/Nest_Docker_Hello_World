import { Controller, Get, Res, HttpStatus, Param, NotFoundException, 
    Post, Body, Put, Query, Delete } from '@nestjs/common';
import { InputStrDTO } from './dto/input.dto';
import { PostalService } from './postal.service';

@Controller('postal')
export class PostalController {
    constructor(private postalService: PostalService) { }
    // Lookup Postcode
    @Post()
    async lookup(@Body() inputStrDTO: InputStrDTO ) {
        const trust = await this.postalService.lookup(inputStrDTO)
        try {
            await this.postalService.writeDB(trust, inputStrDTO)
            return ({ 
                "trust": trust
            });
        } catch (err) {
            console.log(err)
            return ({
                "trust": trust
            })
        }
    }

    @Get()
    async readDB() {
        return (await this.postalService.readDB()).Items
    }
}
