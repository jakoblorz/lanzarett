import { EndpointContractRoleType } from "../contract/EndpointContract";

export type ContractServerResponseType = "string" | "object";
export type ContractServerSuccessResponseCode = 200 | 201 | 202 | 203 | 204;
export type ContractServerErrorResponseCode = 400 | 403 | 404 | 500;

/**
 * a general interface to standardize communication between
 * contract server and low-level protocol servers (http, etc..)
 */
export interface IContractServerResponse {

    /**
     * success/error code to signal status
     */
    code: ContractServerErrorResponseCode | ContractServerSuccessResponseCode;

    /**
     * type of the message (string could be json)
     */
    type: ContractServerResponseType;

    /**
     * message to send (payload)
     */
    message: string;
}

export class ContractServerResponse {

    /**
     * create a response that can be sent back to the client
     * @param code error/success code to send
     * @param type signal content type
     * @param message payload to send
     */
    private static createResponse(
        code: ContractServerErrorResponseCode | ContractServerSuccessResponseCode,
        type: ContractServerResponseType,
        message: string): IContractServerResponse {
        return { code, message, type };
    }

    /**
     * create a 404 not found error
     */
    public static NotFoundError(): IContractServerResponse {
        return ContractServerResponse.createResponse(404, "string", "Not Found Error");
    }

    /**
     * create a 403 forbidden error
     */
    public static ForbiddenError(): IContractServerResponse {
        return ContractServerResponse.createResponse(403, "string", "Forbidden Error");
    }

    /**
     * create a 400 format error
     */
    public static FormatError(): IContractServerResponse {
        return ContractServerResponse.createResponse(400, "string", "Format Error");
    }

    /**
     * create a 500 general/server error
     */
    public static ServerError(): IContractServerResponse {
        return ContractServerResponse.createResponse(500, "string", "Server Error");
    }

    /**
     * send a response to the client
     * @param role current execution role
     * @param data data to send
     */
    public static Success(role: EndpointContractRoleType, data: any): IContractServerResponse {
        
        if (role === "create") { // create roles will resolve with success code 201
            return typeof data === "object" ?
                ContractServerResponse.createResponse(201, "object", JSON.stringify(data)) :
                ContractServerResponse.createResponse(201, "string", data);

        } else if (role === "read") { // read roles will resolve with success code 200
            return typeof data === "object" ?
                ContractServerResponse.createResponse(200, "object", JSON.stringify(data)) :
                ContractServerResponse.createResponse(200, "string", data);

        } else if (role === "update") { // update roles will resolve with success code 202
            return typeof data === "object" ?
                ContractServerResponse.createResponse(202, "object", JSON.stringify(data)) :
                ContractServerResponse.createResponse(202, "string", data);

        } else if (role === "delete") { // delete roles will resolve with success code 203
            return typeof data === "object" ?
                ContractServerResponse.createResponse(203, "object", JSON.stringify(data)) :
                ContractServerResponse.createResponse(203, "string", data);

        } else if (role === "ping") { // ping roles will resolve with success code 204
            return typeof data === "object" ?
                ContractServerResponse.createResponse(204, "object", JSON.stringify(data)) :
                ContractServerResponse.createResponse(204, "string", data);
        }
    }
}