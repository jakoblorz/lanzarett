export namespace ServiceEndpointResponse {

    /**
     * different status codes depending on endpoint role:
     * read(200), create(202), update(203) and delete(204)
     */
    export type ServiceEndpointResponseStatusCode = 200 | 202 | 203 | 204;

    /**
     * different error codes depending on error type:
     * format(400), forbidden(403), notfound(404) and general server(500)
     */
    export type ServiceEndpointResponseErrorCode = 400 | 403 | 404 | 500;

    /**
     * content_type types to signal how to process content_data
     */
    export type ServiceEndpointResponseContentType = "boolean" | "number" | "object" | "string";

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
    export class ServiceEndpointResponse<DataType = boolean | number | object | string> implements IServiceEndpointResponse {
        
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
        export class FormatErrorResponse extends ServiceEndpointResponse<string> {
            constructor() {
                super("Format Error", 400);
            }
        }

        /**
         * Forbidden Error Response is used to signal that a request
         * is not allowed to access this endpoint. Status Code is 403
         */
        export class ForbiddenErrorResponse extends ServiceEndpointResponse<string> {
            constructor() {
                super("Forbidden Error", 403);
            }
        }

        /**
         * Not Found Error Response is used to signal that a request
         * is requesting a resource or a endpoint that does not exist.
         * Status Code is 404
         */
        export class NotFoundErrorResponse extends ServiceEndpointResponse<string> {
            constructor() {
                super("Not Found Error", 404);
            }
        }

        /**
         * Server Error Response is used to signal that a request
         * could not be properly processed because of a problem server-side.
         * Status Code is 500
         */
        export class ServerErrorResponse extends ServiceEndpointResponse<string> {
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
        export class CreateServiceEndpointResponse<DataType> extends ServiceEndpointResponse<DataType> {
            constructor(data: DataType) {
                super(data, 202);
            }
        }

        /**
         * ReadServiceEndpointResponse is a standard response from a
         * read-typed endpoint. it features its standard response code
         * of 200
         */
        export class ReadServiceEndpointResponse<DataType> extends ServiceEndpointResponse<DataType> {
            constructor(data: DataType) {
                super(data, 200);
            }
        }

        /**
         * UpdateServiceEndpointResponse is a standard response from a
         * update-typed endpoint. it features its standard response code
         * of 203
         */
        export class UpdateServiceEndpointResponse<DataType> extends ServiceEndpointResponse<DataType> {
            constructor(data: DataType) {
                super(data, 203);
            }
        }

        /**
         * DeleteServiceEndpointResponse is a standard response from a
         * delete-typed endpoint. it features its standard response code
         * of 204
         */
        export class DeleteServiceEndpointResponse<DataType> extends ServiceEndpointResponse<DataType>{
            constructor(data: DataType) {
                super(data, 204);
            }
        }

    }

}

export namespace ServiceEndpoint {

    export type ServiceEndpointRole = "create" | "read" | "update" | "delete";

    export abstract class ServiceEndpoint<DataType> {

        public name: string;
        public args: string[];
        public role: ServiceEndpointRole;
        public sample: DataType;

        constructor(name: string, args: string[], role: ServiceEndpointRole, sample: DataType) {
            this.name = name;
            this.args = args;
            this.role = role;
            this.sample = sample;
        }

        public async abstract call(...args: any[]): Promise<ServiceEndpointResponse.IServiceEndpointResponse>


        public Success(data: DataType) {

            if (this.role === "create") {
                return new ServiceEndpointResponse.ServiceEndpointRoleResponse.CreateServiceEndpointResponse(data);
            } else if (this.role === "read") {
                return new ServiceEndpointResponse.ServiceEndpointRoleResponse.ReadServiceEndpointResponse(data);
            } else if (this.role === "update") {
                return new ServiceEndpointResponse.ServiceEndpointRoleResponse.UpdateServiceEndpointResponse(data);
            } else if (this.role === "delete") {
                return new ServiceEndpointResponse.ServiceEndpointRoleResponse.DeleteServiceEndpointResponse(data);
            }

        }

        public FormatError() {
            return new ServiceEndpointResponse.ServiceEndpointErrorResponse.FormatErrorResponse();
        }

        public ForbiddenError() {
            return new ServiceEndpointResponse.ServiceEndpointErrorResponse.ForbiddenErrorResponse();
        }

        public NotFoundError() {
            return new ServiceEndpointResponse.ServiceEndpointErrorResponse.NotFoundErrorResponse();
        }

        public ServerError() {
            return new ServiceEndpointResponse.ServiceEndpointErrorResponse.ServerErrorResponse();
        }
    }

    export namespace ServiceEndpointRoleClasses {

        export abstract class CreateServiceEndpoint<DataType> extends ServiceEndpoint<DataType> {
            constructor(name: string, args: string[], sample: DataType) {
                super(name, args, "create", sample);
            }
        }

        export abstract class ReadServiceEndpoint<DataType> extends ServiceEndpoint<DataType> {
            constructor(name: string, args: string[], sample: DataType) {
                super(name, args, "read", sample);
            }
        }

        export abstract class UpdateServiceEndpoint<DataType> extends ServiceEndpoint<DataType> {
            constructor(name: string, args: string[], sample: DataType) {
                super(name, args, "update", sample);
            }
        }

        export abstract class DeleteServiceEndpoint<DataType> extends ServiceEndpoint<DataType> {
            constructor(name: string, args: string[], sample: DataType) {
                super(name, args, "delete", sample);
            }
        }
    }
}

export abstract class ServiceEndpointMapper {

    public async abstract listen(port: number): Promise<void>;

    constructor(private endpoints: ServiceEndpoint.ServiceEndpoint<any>[]) {

    }

    public async invokeServiceEndpointFromRequest(
        role: ServiceEndpoint.ServiceEndpointRole,
        args: any): Promise<ServiceEndpointResponse.IServiceEndpointResponse> {

        const name = args["rpc"];
        if (name === undefined) {
            return new ServiceEndpointResponse
                .ServiceEndpointErrorResponse.FormatErrorResponse();
        }

        const endpoint = this.endpoints
            .filter((v) => v.role === role)
            .filter((v) => v.name === name)[0];
        if (endpoint === undefined) {
            return new ServiceEndpointResponse
                .ServiceEndpointErrorResponse.NotFoundErrorResponse();
        }

        const isMissingArguments = endpoint.args
            .filter((v) => args[v] === undefined).length > 0;
        if (isMissingArguments) {
            return new ServiceEndpointResponse
                .ServiceEndpointErrorResponse.FormatErrorResponse();
        }

        return await endpoint.call.apply(null, endpoint.args.map((a) => args[a]));

    }
}