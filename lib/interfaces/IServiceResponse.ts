export interface IServiceResponse {
    content_data: string;
    status_code: 400 | 403 | 404 | 500 | 200;
}