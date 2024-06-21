import ApiException from "./ApiException";

class InternalServerErrorException extends ApiException{
    /**
     * Initialize the new `ApiException` instance.
     * @param {String} message Message from the response.
     * @param  {...any} params 
     */
    constructor(message = 'Hubo problema al realizar la acción. Intente más tarde.', ...params){
        super(500, message, ...params)

        this.name = "InternalServerError";
    }
}

export default InternalServerErrorException;