export namespace ServiceEndpointResponse {

    export type ServiceEndpointResponseStatusCode = 200 | 202 | 203 | 204;
    export type ServiceEndpointResponseErrorCode = 400 | 403 | 404 | 500;

    export interface IServiceEndpointResponse {
        content_type: string;
        content_data: string;
        status_code: ServiceEndpointResponseErrorCode | ServiceEndpointResponseStatusCode;
    }

    export class ServiceEndpointResponse<DataType = boolean | number | object | string> implements IServiceEndpointResponse {
        
        public content_type: string;
        public content_data: string;
        public status_code: ServiceEndpointResponseErrorCode | ServiceEndpointResponseStatusCode;

        constructor(data: DataType, code: ServiceEndpointResponseErrorCode | ServiceEndpointResponseStatusCode) {
            this.content_type = typeof data;
            this.status_code = code;

            if (typeof data === "boolean") {
                this.content_data = data === true ? "true" : "false";
            } else if (typeof data === "number") {
                this.content_data = data.toString();
            } else if (typeof data === "object") {
                this.content_data = JSON.stringify(data);
            } else if (typeof data === "string") {
                this.content_data = data;
            }

        }
    }

    export namespace ServiceEndpointErrorResponse {
        export class FormatErrorResponse extends ServiceEndpointResponse<string> {
            constructor() {
                super("Format Error", 400);
            }
        }

        export class ForbiddenErrorResponse extends ServiceEndpointResponse<string> {
            constructor() {
                super("Forbidden Error", 403);
            }
        }

        export class NotFoundErrorResponse extends ServiceEndpointResponse<string> {
            constructor() {
                super("Not Found Error", 404);
            }
        }

        export class ServerErrorResponse extends ServiceEndpointResponse<string> {
            constructor() {
                super("Server Error", 500);
            }
        }

    }

    export namespace ServiceEndpointRoleResponse {

        export class CreateServiceEndpointResponse<DataType> extends ServiceEndpointResponse<DataType> {
            constructor(data: DataType) {
                super(data, 202);
            }
        }

        export class ReadServiceEndpointResponse<DataType> extends ServiceEndpointResponse<DataType> {
            constructor(data: DataType) {
                super(data, 200);
            }
        }

        export class UpdateServiceEndpointResponse<DataType> extends ServiceEndpointResponse<DataType> {
            constructor(data: DataType) {
                super(data, 203);
            }
        }

        export class DeleteServiceEndpointResponse<DataType> extends ServiceEndpointResponse<DataType>{
            constructor(data: DataType) {
                super(data, 204);
            }
        }

    }

}