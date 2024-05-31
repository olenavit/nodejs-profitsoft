import {NextFunction, Request, Response, RequestHandler} from "express";
import {plainToInstance} from "class-transformer";
import {validate, ValidationError} from "class-validator";
import {sanitize} from "class-sanitizer";
import {BAD_REQUEST} from "http-status";
import {PracticeQueryDto} from "src/dto/practice/practiceQueryDto";
import {PracticeCreateDto} from "src/dto/practice/practiceCreateDto";
import {PracticeCountDto} from "../../dto/practice/practiceCountDto";


export function createPracticeValidationMiddleware(): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const dtoObj = plainToInstance(PracticeCreateDto, req.body);
    validate(dtoObj, {skipMissingProperties: false}).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const dtoErrors = errors.map((error: ValidationError) =>
            (Object as any).values(error.constraints)).join(", ");
          res.status(BAD_REQUEST).send({message: dtoErrors});
        } else {
          dtoObj.date = new Date(req.body.date);
          sanitize(dtoObj);
          req.body = dtoObj;
          next();
        }
      }
    );
  };
}

export function practiceQueryValidationMiddleware(): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const dto = new PracticeQueryDto(req.query);
    const dtoObj = plainToInstance(PracticeQueryDto, dto);
    validate(dtoObj, {skipMissingProperties: false}).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const dtoErrors = errors.map((error: ValidationError) =>
            (Object as any).values(error.constraints)).join(", ");
          res.status(BAD_REQUEST).send({message: dtoErrors});
        } else {
          req.body = dtoObj;
          next();
        }
      }
    );
  };
}

export function practiceCountValidationMiddleware(): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const dtoObj = plainToInstance(PracticeCountDto, req.body);
    validate(dtoObj, {skipMissingProperties: false}).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const dtoErrors = errors.map((error: ValidationError) =>
            (Object as any).values(error.constraints)).join(", ");
          res.status(BAD_REQUEST).send({message: dtoErrors});
        } else {
          req.body = dtoObj;
          next();
        }
      }
    );
  };
}

