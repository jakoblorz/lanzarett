import { EndpointContractRoleType } from "../contract/EndpointContract";

export type ContractServerResponseType = "string" | "object";
export type ContractServerSuccessResponseCode = 200 | 201 | 202 | 203 | 204;
export type ContractServerErrorResponseCode = 400 | 403 | 404 | 500;

export interface IContractServerResponse {
    code: ContractServerErrorResponseCode | ContractServerSuccessResponseCode;
    type: ContractServerResponseType;
    message: string;
}

export class ContractServerResponse {

    private static createResponse(
        code: ContractServerErrorResponseCode | ContractServerSuccessResponseCode,
        type: ContractServerResponseType,
        message: string): IContractServerResponse {
        return { code, message, type };
    }

    public static NotFoundError(): IContractServerResponse {
        return ContractServerResponse.createResponse(404, "string", "Not Found Error");
    }

    public static ForbiddenError(): IContractServerResponse {
        return ContractServerResponse.createResponse(403, "string", "Forbidden Error");
    }

    public static FormatError(): IContractServerResponse {
        return ContractServerResponse.createResponse(400, "string", "Format Error");
    }

    public static ServerError(): IContractServerResponse {
        return ContractServerResponse.createResponse(500, "string", "Server Error");
    }

    public static Success(role: EndpointContractRoleType, data: any): IContractServerResponse {
        
        if (role === "create") {
            return typeof data === "object" ?
                ContractServerResponse.createResponse(201, "object", JSON.stringify(data)) :
                ContractServerResponse.createResponse(201, "string", data);
        } else if (role === "read") {
            return typeof data === "object" ?
                ContractServerResponse.createResponse(200, "object", JSON.stringify(data)) :
                ContractServerResponse.createResponse(200, "string", data);
        } else if (role === "update") {
            return typeof data === "object" ?
                ContractServerResponse.createResponse(202, "object", JSON.stringify(data)) :
                ContractServerResponse.createResponse(202, "string", data);
        } else if (role === "delete") {
            return typeof data === "object" ?
                ContractServerResponse.createResponse(203, "object", JSON.stringify(data)) :
                ContractServerResponse.createResponse(203, "string", data);
        } else if (role === "ping") {
            return typeof data === "object" ?
                ContractServerResponse.createResponse(204, "object", JSON.stringify(data)) :
                ContractServerResponse.createResponse(204, "string", data);
        }
    }
}