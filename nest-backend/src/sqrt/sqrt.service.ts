import { Injectable } from '@nestjs/common';
import { InputStrDTO } from './dto/input.dto';
    
@Injectable()
export class SqrtService {
    
  async calcSqrt(inputStrDTO: InputStrDTO): Promise<number> {
    const numericalInput : number = Number(inputStrDTO.input);
    return Math.sqrt(numericalInput);
  }  
}
