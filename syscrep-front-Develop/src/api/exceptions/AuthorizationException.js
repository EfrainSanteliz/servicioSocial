import ApiException from "./ApiException";

class AuthorizationException extends ApiException{
    /**
     * Initialize the new `ApiException` instance.
     * @param {String} message Message from the response.
     * @param  {...any} params 
     */
    constructor(message = 'No tiene autorización para realizar esta acción.', ...params){
        super(403, message, ...params)

        this.name = "Authorization";
    }
}

export default AuthorizationException;