import { Injectable } from '@nestjs/common';
import { InputStrDTO } from './dto/input.dto';
import * as log4js from "log4js";
var logger = log4js.getLogger("sqrt")
log4js.configure({ 
    appenders: { sqrt: { type: "file", filename: "sqrt.log" } },
    categories: { default: { appenders: ["sqrt"], level: "debug"}}
});
logger.level = "debug"
logger.debug("Sqrt Information Log")

@Injectable()
export class SqrtService {
    
  async calcSqrt(inputStrDTO: InputStrDTO): Promise<number> {
    try {
      logger.debug("Calculating Square root of: " + inputStrDTO.input)
      const numericalInput : number = Number(inputStrDTO.input);
      logger.debug("The Square Root is: " + Math.sqrt(numericalInput))
      return Math.sqrt(numericalInput);
    } catch (err) {
      logger.debug(err)
      return -1
    }
  }  
}
