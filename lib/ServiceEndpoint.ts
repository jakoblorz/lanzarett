export namespace ServiceEndpointResponse {

    /**
     * different status codes depending on endpoint role:
     * read(200), create(202), update(203) and delete(204)
     */
    export type ServiceEndpointResponseStatusCode = 200 | 201 | 202 | 203;

    /**
     * different error codes depending on error type:
     * format(400), forbidden(403), notfound(404) and general server(500)
     */
    export type ServiceEndpointResponseErrorCode = 400 | 403 | 404 | 500;

    /**
     * content_type types to signal how to process content_data
     */
    export type ServiceEndpointResponseContentType = "boolean" | "number" | "object" | "string";

    export type ServiceEndpointResponseDataType = boolean | number | object | string;

    /**
     * interface to standardise all kinds of responses that
     * get send to the client
     */
    export interface IServiceEndpointResponse {

        /**
         * signal how to process content_data
         */
        content_type: ServiceEndpointResponseContentType;

        /**
         * actual payload to be sent back to the client
         */
        content_data: string;

        /**
         * signal status of the response: either an error or success code
         */
        status_code: ServiceEndpointResponseErrorCode | ServiceEndpointResponseStatusCode;
    }

    /**
     * class implementing response interface
     * can be used to create valid ServiceEndpointResponses
     */
    export class ServiceEndpointResponse<DataType = ServiceEndpointResponseDataType>
        implements IServiceEndpointResponse {
        
        /**
         * signal how to process content_data
         */
        public content_type: ServiceEndpointResponseContentType;

        /**
         * actual payload to be sent back to the client
         */
        public content_data: string;

        /**
         * signal status of the response: either an error or success code
         */
        public status_code: ServiceEndpointResponseErrorCode | ServiceEndpointResponseStatusCode;

        /**
         * create a new response
         * @param data payload containing the data to be sent back to the client
         * @param code signal the status of this response
         */
        constructor(data: DataType, code: ServiceEndpointResponseErrorCode | ServiceEndpointResponseStatusCode) {

            this.status_code = code;

            if (typeof data === "boolean") {
                this.content_type = "boolean";
                this.content_data = data === true ? "true" : "false";

            } else if (typeof data === "number") {
                this.content_type = "number";
                this.content_data = data.toString();

            } else if (typeof data === "object") {
                this.content_type = "object";
                this.content_data = JSON.stringify(data);

            } else if (typeof data === "string") {
                this.content_type = "string";
                this.content_data = data;
            }

        }
    }

    export namespace ServiceEndpointErrorResponse {

        /**
         * Format Error Response is used to signal that a request
         * does not have all required arguments or that the rpc argument
         * is missing. Status Code is 400
         */
        export class FormatErrorResponse
            extends ServiceEndpointResponse<string> {

            constructor() {
                super("Format Error", 400);
            }
        }

        /**
         * Forbidden Error Response is used to signal that a request
         * is not allowed to access this endpoint. Status Code is 403
         */
        export class ForbiddenErrorResponse
            extends ServiceEndpointResponse<string> {

            constructor() {
                super("Forbidden Error", 403);
            }
        }

        /**
         * Not Found Error Response is used to signal that a request
         * is requesting a resource or a endpoint that does not exist.
         * Status Code is 404
         */
        export class NotFoundErrorResponse
            extends ServiceEndpointResponse<string> {

            constructor() {
                super("Not Found Error", 404);
            }
        }

        /**
         * Server Error Response is used to signal that a request
         * could not be properly processed because of a problem server-side.
         * Status Code is 500
         */
        export class ServerErrorResponse
            extends ServiceEndpointResponse<string> {

            constructor() {
                super("Server Error", 500);
            }
        }

    }

    export namespace ServiceEndpointRoleResponse {

        /**
         * CreateServiceEndpointResponse is a standard response from a
         * create-typed endpoint. it features its standard response code
         * of 202
         */
        export class CreateServiceEndpointResponse<DataType>
            extends ServiceEndpointResponse<DataType> {

            constructor(data: DataType) {
                super(data, 201);
            }
        }

        /**
         * ReadServiceEndpointResponse is a standard response from a
         * read-typed endpoint. it features its standard response code
         * of 200
         */
        export class ReadServiceEndpointResponse<DataType>
            extends ServiceEndpointResponse<DataType> {

            constructor(data: DataType) {
                super(data, 200);
            }
        }

        /**
         * UpdateServiceEndpointResponse is a standard response from a
         * update-typed endpoint. it features its standard response code
         * of 203
         */
        export class UpdateServiceEndpointResponse<DataType>
            extends ServiceEndpointResponse<DataType> {

            constructor(data: DataType) {
                super(data, 202);
            }
        }

        /**
         * DeleteServiceEndpointResponse is a standard response from a
         * delete-typed endpoint. it features its standard response code
         * of 204
         */
        export class DeleteServiceEndpointResponse<DataType>
            extends ServiceEndpointResponse<DataType>{

            constructor(data: DataType) {
                super(data, 203);
            }
        }

    }

}

export namespace ServiceEndpoint {

    /**
     * there are 4 types of endpoints: create, read, update and deleted typed endpoints;
     * each process data in a manner following their role
     */
    export type ServiceEndpointRole = "create" | "read" | "update" | "delete";

    export interface IServiceEndpoint<T> {
        name: string;
        args: string[];
        role: ServiceEndpointRole;
        sample: T;
        callback: (...args: any[]) => Promise<ServiceEndpointResponse.IServiceEndpointResponse>;
    }

    /**
     * abstract implementation of a ServiceEndpoint
     * contains a name to be uniquely identifiable, args of the abstract call
     * method, the unique role and a response data sample
     */
    export abstract class ServiceEndpoint<DataType> implements IServiceEndpoint<DataType> {

        /**
         * unique name to be identifiable
         */
        public name: string;

        /**
         * arguments of the abstract call method
         */
        public args: string[];

        /**
         * data-process role
         */
        public role: ServiceEndpointRole;

        /**
         * response data sample
         */
        public sample: DataType;

        /**
         * method that will be called
         */
        public callback: (...args: any[]) => Promise<ServiceEndpointResponse.IServiceEndpointResponse>;


        /**
         * create a new ServiceEndpoint
         * @param name unqiue name for this endpoint
         * @param args name the arguments of the abstract call method on a protocol level
         * @param role select the role of this endpoint
         * @param sample give a sample of a successful payload
         */
        constructor(name: string, args: string[], role: ServiceEndpointRole, sample: DataType) {
            this.name = name;
            this.args = args;
            this.role = role;
            this.sample = sample;
            this.callback = this.call;
        }

        public async abstract call(...args: any[]):
            Promise<ServiceEndpointResponse.IServiceEndpointResponse>

        /**
         * respond with a success-flag, sending data as well
         * @param data payload to send back to the client
         */
        public Success(data: DataType) {

            if (this.role === "create") {
                return new ServiceEndpointResponse.ServiceEndpointRoleResponse
                    .CreateServiceEndpointResponse(data) as ServiceEndpointResponse.IServiceEndpointResponse;

            } else if (this.role === "read") {
                return new ServiceEndpointResponse.ServiceEndpointRoleResponse
                    .ReadServiceEndpointResponse(data) as ServiceEndpointResponse.IServiceEndpointResponse;

            } else if (this.role === "update") {
                return new ServiceEndpointResponse.ServiceEndpointRoleResponse
                    .UpdateServiceEndpointResponse(data) as ServiceEndpointResponse.IServiceEndpointResponse;

            } else if (this.role === "delete") {
                return new ServiceEndpointResponse.ServiceEndpointRoleResponse
                    .DeleteServiceEndpointResponse(data) as ServiceEndpointResponse.IServiceEndpointResponse;
            }

        }

        /**
         * respond with a format error, the data given was somewhat
         * wrongly formatted
         */
        public FormatError() {
            return new ServiceEndpointResponse.ServiceEndpointErrorResponse
                .FormatErrorResponse() as ServiceEndpointResponse.IServiceEndpointResponse;
        }

        /**
         * respond with a forbidden error, the request is not authenticated or is
         * at least not allowed to proceed or request this endpoints
         */
        public ForbiddenError() {
            return new ServiceEndpointResponse.ServiceEndpointErrorResponse
                .ForbiddenErrorResponse() as ServiceEndpointResponse.IServiceEndpointResponse;
        }

        /**
         * respond with a not found error, the requested resource was not found
         * or the endpoint was not found
         */
        public NotFoundError() {
            return new ServiceEndpointResponse.ServiceEndpointErrorResponse
                .NotFoundErrorResponse() as ServiceEndpointResponse.IServiceEndpointResponse;
        }

        /**
         * respond with a general error: a error occured on the server side
         */
        public ServerError() {
            return new ServiceEndpointResponse.ServiceEndpointErrorResponse
                .ServerErrorResponse() as ServiceEndpointResponse.IServiceEndpointResponse;
        }
    }

    export namespace ServiceEndpointRoleClasses {

        /**
         * a ServiceEndpoint thats purpose is to create a resource
         */
        export abstract class CreateServiceEndpoint<DataType>
            extends ServiceEndpoint<DataType> {

            constructor(name: string, args: string[], sample: DataType) {
                super(name, args, "create", sample);
            }
        }

        /**
         * a ServiceEndpoint thats purpose is to respond with a resource
         */
        export abstract class ReadServiceEndpoint<DataType>
            extends ServiceEndpoint<DataType> {

            constructor(name: string, args: string[], sample: DataType) {
                super(name, args, "read", sample);
            }
        }

        /**
         * a ServiceEndpoint thats purpose is to update a resource
         */
        export abstract class UpdateServiceEndpoint<DataType>
            extends ServiceEndpoint<DataType> {

            constructor(name: string, args: string[], sample: DataType) {
                super(name, args, "update", sample);
            }
        }

        /**
         * a ServiceEndpoint thats purpose is to remove a resource
         */
        export abstract class DeleteServiceEndpoint<DataType>
            extends ServiceEndpoint<DataType> {

            constructor(name: string, args: string[], sample: DataType) {
                super(name, args, "delete", sample);
            }
        }
    }
}

export class ServiceEndpointNamespace {

    public name: string;
    public endpoints: ServiceEndpoint.IServiceEndpoint<any>[];

    constructor(name: string) {
        this.name = name;
        this.endpoints = [];
    }

    /**
     * register a function to be accessible from http requests
     * @param role specify the role of this endpoint function
     * @param name name this endpoint functions - must be unique within this namespace
     * @param fn the actual endpoint function
     * @param sample provide as sample of a response
     */
    public register<T = ServiceEndpointResponse.ServiceEndpointResponseDataType>(
        role: ServiceEndpoint.ServiceEndpointRole,
        name: string, fn: (...args: any[]) => Promise<ServiceEndpointResponse.ServiceEndpointResponseDataType | ServiceEndpointResponse.IServiceEndpointResponse>,
        sample: T) {

        // wrapper function to respond to the client using the correct response structure
        const callbackFn = async (...args: any[]): Promise<ServiceEndpointResponse.IServiceEndpointResponse> => {
            const data = await fn.apply(this, args);

            if ("content_type" in data && "content_data" in data && "status_code" in data) {
                return data as ServiceEndpointResponse.IServiceEndpointResponse;
            }

            if (role === "create") {
                return new ServiceEndpointResponse.ServiceEndpointRoleResponse
                    .CreateServiceEndpointResponse(data) as ServiceEndpointResponse.IServiceEndpointResponse;

            } else if (role === "read") {
                return new ServiceEndpointResponse.ServiceEndpointRoleResponse
                    .ReadServiceEndpointResponse(data) as ServiceEndpointResponse.IServiceEndpointResponse;

            } else if (role === "update") {
                return new ServiceEndpointResponse.ServiceEndpointRoleResponse
                    .UpdateServiceEndpointResponse(data) as ServiceEndpointResponse.IServiceEndpointResponse;

            } else {
                return new ServiceEndpointResponse.ServiceEndpointRoleResponse
                    .DeleteServiceEndpointResponse(data) as ServiceEndpointResponse.IServiceEndpointResponse;
            }
        };
        
        // push this endpoint function to the list of endpoint functions, 
        // making use of the wrapper function itself
        this.endpoints.push({
            callback: callbackFn,
            args: this.extractFunctionArguments(fn),
            name: this.name + "." + name,
            role: role,
            sample: sample
        });
    }

    /**
     * extractFunctionArguments
     */
    public extractFunctionArguments(fn: (...args: any[]) => any)  {
        if (fn.toString().indexOf("function") === -1) {
            throw new Error("could not find function string in callback argument - did you use a fat-arrow function definition?");
        }
        
        return (fn.toString()
            .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg, "")
            .match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m) as RegExpMatchArray)[1]
            .split(/,/);      
    }
}

/**
 * a abstract class to provide a method to invoke a endpoint from a list
 */
export abstract class ServiceEndpointMapper {

    public async abstract listen(port: number): Promise<void>;

    /**
     * create a new ServiceEndpointMapper
     * @param endpoints list of endpoints that need to be available
     */
    constructor(private endpoints: ServiceEndpoint.ServiceEndpoint<any>[]) {

    }

    /**
     * search for the endpoint mentioned in the request and execute it.
     * will return a IServiceEndpointResponse in any case
     * @param role select the role of this request
     * @param args arguments the request delivered
     */
    public async invokeServiceEndpointFromRequest(
        role: ServiceEndpoint.ServiceEndpointRole,
        args: any): Promise<ServiceEndpointResponse.IServiceEndpointResponse> {

        if (args === undefined) {
            return new ServiceEndpointResponse
                .ServiceEndpointErrorResponse.FormatErrorResponse();
        }
        
        // search for the name argument in the argument object,
        // should be found under key "rpc" - return a 
        // Format Error if not found
        const name = args["rpc"];
        if (name === undefined) {
            return new ServiceEndpointResponse
                .ServiceEndpointErrorResponse.FormatErrorResponse();
        }

        // search for the endpoint object in the endpoint list,
        // matching the role and name filters - return a
        // Not Found Error if not found
        const endpoint = this.endpoints
            .filter((v) => v.role === role)
            .filter((v) => v.name === name)[0];
        if (endpoint === undefined) {
            return new ServiceEndpointResponse
                .ServiceEndpointErrorResponse.NotFoundErrorResponse();
        }

        // check if there are any arguments missing the endpoint
        // requires - return a Format Error if any are missing
        const isMissingArguments = endpoint.args
            .filter((v) => args[v] === undefined).length > 0;
        if (isMissingArguments) {
            return new ServiceEndpointResponse
                .ServiceEndpointErrorResponse.FormatErrorResponse();
        }

        // execute the call method of the endpoint - using
        // the apply function a array (sorted using the map function)
        // can be passed as arguments - try to execute, catch errors
        // if errors occured, return a Server Error, otherwise return
        // the result of the endpoint call method (which can also
        // be an error!)
        try {

            return await endpoint.callback.apply(endpoint, endpoint.args.map((a) => args[a]));

        } catch (err) {
            return new ServiceEndpointResponse.ServiceEndpointErrorResponse
                .ServerErrorResponse();
        }
    }
}