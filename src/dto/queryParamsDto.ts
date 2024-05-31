import {IsNumberString} from "class-validator";
import Constants from "src/commons/constants";

export class QueryParamsDto {
  @IsNumberString({}, {message: Constants.MESSAGES.QUERY_PARAMS.FROM_NOT_VALID})
    from = "0";
  @IsNumberString({}, {message: Constants.MESSAGES.QUERY_PARAMS.SIZE_NOT_VALID})
    size = "10";
}
