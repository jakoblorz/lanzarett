import { EndpointContractRoleType } from "../../Contracts/EndpointContract/EndpointContractRoleType";
import { ContractServerResponseErrorCode } from "./ContractServerResponseErrorCode";
import { ContractServerResponseSuccessCode } from "./ContractServerResponseSuccessCode";
import { ContractServerResponseType } from "./ContractServerResponseType";
import { IContractServerResponse } from "./IContractServerResponse";

/**
 * implementation of the IContractServerResponse,
 * adding static Error/Success Constructors
 */
export class ContractServerResponse implements IContractServerResponse {

    code: ContractServerResponseErrorCode | ContractServerResponseSuccessCode;
    type: ContractServerResponseType;
    message: string;

    constructor(code: ContractServerResponseErrorCode | ContractServerResponseSuccessCode, type: ContractServerResponseType, message: string) {
        this.code = code;
        this.type = type;
        this.message = message;
    }

    /**
     * create a 404 not found error
     */
    public static NotFoundError(): IContractServerResponse {
        return new ContractServerResponse(404, "string", "Not Found Error");
    }

    /**
     * create a 403 forbidden error
     */
    public static ForbiddenError(): IContractServerResponse {
        return new ContractServerResponse(403, "string", "Forbidden Error");
    }

    /**
     * create a 400 format error
     */
    public static FormatError(): IContractServerResponse {
        return new ContractServerResponse(400, "string", "Format Error");
    }

    /**
     * create a 500 general/server error
     */
    public static ServerError(): IContractServerResponse {
        return new ContractServerResponse(500, "string", "Server Error");
    }

    /**
     * send a response to the client
     * @param role current execution role
     * @param data data to send
     */
    public static Success(role: EndpointContractRoleType, data: any): IContractServerResponse {
        
        if (role === "create") { // create roles will resolve with success code 201
            return typeof data === "object" ?
                new ContractServerResponse(201, "object", JSON.stringify(data)) :
                new ContractServerResponse(201, "string", data);

        } else if (role === "read") { // read roles will resolve with success code 200
            return typeof data === "object" ?
                new ContractServerResponse(200, "object", JSON.stringify(data)) :
                new ContractServerResponse(200, "string", data);

        } else if (role === "update") { // update roles will resolve with success code 202
            return typeof data === "object" ?
                new ContractServerResponse(202, "object", JSON.stringify(data)) :
                new ContractServerResponse(202, "string", data);

        } else if (role === "delete") { // delete roles will resolve with success code 203
            return typeof data === "object" ?
                new ContractServerResponse(203, "object", JSON.stringify(data)) :
                new ContractServerResponse(203, "string", data);

        } else if (role === "ping") { // ping roles will resolve with success code 205
            return typeof data === "object" ?
                new ContractServerResponse(205, "object", JSON.stringify(data)) :
                new ContractServerResponse(205, "string", data);
        }
        
        return ContractServerResponse.ServerError();
    }
}