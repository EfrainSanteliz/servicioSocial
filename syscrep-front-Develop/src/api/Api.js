import { ApiException, ExpiredSessionException, AuthorizationException, NotFoundException, ValidationException, InternalServerErrorException } from './exceptions'

class Api {
    BaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
    HTTPCodes = { 
        "Unauthorized":  401,
        "Forbidden": 403,
        "NotFound": 404,
        "UnprocessableEntity": 422,
        "InternalServerError": 500
    }

    /**
     * Perform an API call, and get the response.
     * 
     * @param {Promise} request Axios request object of the API call.
     * @returns {AxiosResponse} The API response, if successful.
     * 
     * @throws {ExpiredSessionException}
     * @throws {AuthorizationException}
     * @throws {NotFoundException}
     * @throws {ValidationException}
     * @throws {InternalServerErrorException}
     * @throws {ApiException}
     */
    async perform(request){
        try{
            const result = await request();

            return result;
        } catch(e){
            if (!e.response){
                throw e;
            }

            return this.handleAPIError(e.response)
        }
    }

    /**
     * Throw an `ApiException` that fits the response status.
     * 
     * @param {Object} response The unsuccessful axios response.
     */
    handleAPIError(response){
        const { status, data } = response;

        switch (status) {
            case this.HTTPCodes.Unauthorized:
                throw new ExpiredSessionException(data.error || undefined);

            case this.HTTPCodes.Forbidden:
                throw new AuthorizationException(data.message);

            case this.HTTPCodes.NotFound:
                throw new NotFoundException(data.message);

            case this.HTTPCodes.UnprocessableEntity:
                throw new ValidationException(data.errors);

            case this.HTTPCodes.InternalServerError:
                throw new InternalServerErrorException(data.error || data.message || undefined);

        
            default:
                throw new ApiException(status)
        }
    }

    generateAbsolutePath(relativePath){
        return this.BaseUrl + '/' + relativePath;
    }

    getAxiosConfig(){
        return {
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };
    }

    sanitizeParameters(query = {}) {
        Object.entries(query).forEach(([name, value]) => {
            if (value === undefined || (!parseInt(value) && !value?.length)) {
                delete query[name]
            }
        });

        return query;
    }
}

export default Api;