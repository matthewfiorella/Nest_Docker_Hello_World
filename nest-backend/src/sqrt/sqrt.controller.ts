import { Controller, Get, Res, HttpStatus, Param, NotFoundException, 
         Post, Body, Put, Query, Delete, UseGuards, UseFilters } from '@nestjs/common';
import { SqrtService } from './sqrt.service';
import { InputStrDTO } from './dto/input.dto'
import { ValidateString } from './shared/pipes/validate-string.pipes';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthExceptionFilter } from 'src/common/exception/auth-exception.filter';
@Controller('sqrt')
export class SqrtController {
    constructor(private sqrtService: SqrtService) { }

    // Calculate a sqrt
    @UseFilters(AuthExceptionFilter)
    @UseGuards(JwtAuthGuard)
    @Post()
    async calcSqrt(@Res() res, @Body(new ValidateString()) inputStrDTO: InputStrDTO) {
        const calcSqrt = await this.sqrtService.calcSqrt(inputStrDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Sqrt has been calculated',
            sqrt: calcSqrt
        });
    }

}
