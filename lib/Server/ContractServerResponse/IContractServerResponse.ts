import { ContractServerResponseErrorCode } from "./ContractServerResponseErrorCode";
import { ContractServerResponseSuccessCode } from "./ContractServerResponseSuccessCode";
import { ContractServerResponseType } from "./ContractServerResponseType";
/**
 * a general interface to standardize communication between
 * contract server and low-level protocol servers (http, etc..)
 */
export interface IContractServerResponse {

    /**
     * success/error code to signal status
     */
    code: ContractServerResponseErrorCode | ContractServerResponseSuccessCode;

    /**
     * type of the message (string could be json)
     */
    type: ContractServerResponseType;

    /**
     * message to send (payload)
     */
    message: string;
}