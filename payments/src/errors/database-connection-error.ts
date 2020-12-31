import {CustomError} from './custom-error'

export class DatabaseConnectionError extends CustomError{
    reason = ''
    statusCode = 500
    constructor(){
        super('database connection'); 
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
    }

    serializeErrors(){
        return [
            {message: this.reason}
        ]
    }
}