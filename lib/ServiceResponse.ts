import { IServiceResponse } from "./interfaces/IServiceResponse";

export class ServiceResponse<DataType> implements IServiceResponse {

    public content_data: string;
    public status_code: 400 | 403 | 404 | 500 | 200;


    constructor(data: DataType, code: 400 | 403 | 404 | 500 | 200) {
        this.status_code = code;
        this.content_data = JSON.stringify(data);
    }

    public static NotFoundError() {
        return new ServiceResponse({ error: "Not Found Error" }, 404);
    }

    public static FormatError() {
        return new ServiceResponse({ error: "Format Error" }, 400);
    }

    public static ForbiddenError() {
        return new ServiceResponse({ error: "Forbidden Error" }, 403);
    }

    public static ServerError() {
        return new ServiceResponse({ error: "Server Error" }, 500);
    }
}