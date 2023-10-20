import { Controller, Get, Res, HttpStatus, Param, NotFoundException, 
         Post, Body, Put, Query, Delete } from '@nestjs/common';
import { SqrtService } from './sqrt.service';
import { InputStrDTO } from './dto/input.dto'
import { ValidateString } from './shared/pipes/validate-string.pipes';
@Controller('sqrt')
export class SqrtController {
    constructor(private sqrtService: SqrtService) { }

    // Calculate a sqrt
    @Post()
    async calcSqrt(@Res() res, @Body(new ValidateString()) inputStrDTO: InputStrDTO) {
        const calcSqrt = await this.sqrtService.calcSqrt(inputStrDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Sqrt has been calculated',
            sqrt: calcSqrt
        });
    }

}
