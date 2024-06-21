import ApiException from "./ApiException";

class ExpiredSessionException extends ApiException{
    /**
     * Initialize the new `ApiException` instance.
     * @param {String} message Message from the response.
     * @param  {...any} params 
     */
    constructor(message = 'La sesión expiró.', ...params){
        super(401, message, ...params)

        this.name = "ExpiredSession";
    }
}

export default ExpiredSessionException;