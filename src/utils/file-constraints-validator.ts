import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Injectable } from '@nestjs/common';



@Injectable()
@ValidatorConstraint({ name: 'isArrayFiles', async: false })
export class IsArrayFilesConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        if (!Array.isArray(value)) {
            return false;
        }

        for (const item of value) {
            if (!item.originalname || !item.mimetype) {
                return false;
            }
        }

        return true;
    }

    defaultMessage(args: ValidationArguments) {
        return 'Photos array should contain Express.Multer.File objects only.';
    }
}
