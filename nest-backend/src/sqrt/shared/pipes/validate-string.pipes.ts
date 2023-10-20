import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { InputStrDTO } from '../../dto/input.dto'

@Injectable()
export class ValidateString implements PipeTransform<InputStrDTO> {
  async transform(value: InputStrDTO, metadata: ArgumentMetadata) {
    const isValid = !isNaN(Number( value.input ))
    if (!isValid) {
        throw new BadRequestException('Not a number!');
    }
    return value;
  }
}