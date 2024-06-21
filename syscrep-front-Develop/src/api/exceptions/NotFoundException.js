import ApiException from "./ApiException";

class NotFoundException extends ApiException{
    /**
     * Initialize the new `ApiException` instance.
     * @param {String} message Message from the response.
     * @param  {...any} params 
     */
    constructor(message = 'Registro no encontrado.', ...params){
        super(404, message, ...params)

        this.name = "NotFound";
    }
}

export default NotFoundException;