import ApiException from "./ApiException";

class ValidationException extends ApiException{
    
    errors = {}

    /**
     * Initialize the new `ApiException` instance.
     * @param {Array} errors Validation errors from the response.
     * @param  {...any} params 
     */
    constructor(errors, ...params){
        super(422, ...params)

        this.name = "Validation";
        this.errors = errors
    }
}

export default ValidationException;