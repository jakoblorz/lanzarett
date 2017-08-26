import { TServiceErrorCodes } from "../types/TServiceErrorCodes";
import { TServiceSuccessCodes } from "../types/TServiceSuccessCodes";

export interface IServiceResponse {
    content_data: string;
    status_code: TServiceErrorCodes | TServiceSuccessCodes;
}