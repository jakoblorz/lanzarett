import { TServiceErrorCodes } from "./types/TServiceErrorCodes";
import { TServiceSuccessCodes } from "./types/TServiceSuccessCodes";
import { IServiceResponse } from "./interfaces/IServiceResponse";

export class ServiceResponse<DataType> implements IServiceResponse {

    public content_data: string;
    public status_code: TServiceErrorCodes | TServiceSuccessCodes;


    constructor(data: DataType, code: TServiceErrorCodes | TServiceSuccessCodes) {
        this.status_code = code;
        this.content_data = JSON.stringify(data);
    }
}