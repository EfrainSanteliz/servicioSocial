class ApiException extends Error{

    status = 0

    /**
     * Initialize the new `ApiException` instance.
     * @param {Number} status The HTTP Status code from the API response.
     * @param  {...any} params 
     */
    constructor(status = 0, ...params){
        super(...params)

        this.status = Number(status);
        this.name = "API Error";
    }
}

export default ApiException;