import { AbstractControl, ValidationErrors } from '@angular/forms';

export class DateValidators{
    static greaterThanToday(control: AbstractControl): ValidationErrors|null{
        const date = new Date();
        const fieldValue = new Date((control.value) as string);
        return fieldValue.getTime() > date.getTime() ? {greaterThanToday: true} : null ; 

    }
}