import { ServiceEndpointResponse } from "../lib/ServiceEndpointResponse";
import { ServiceEndpoint } from "../lib/ServiceEndpoint";

import * as http from "http";

export module HttpTools {

    export const sendIServiceResponse = function (
        response: http.ServerResponse,
        data: ServiceEndpointResponse.IServiceEndpointResponse) {
            
        response.writeHead(data.status_code, { "Content-Type": "application/json" });
        response.end(JSON.stringify(data));
    };

    export const isValidApiUrl = function (
        path: string[]) {
      
        return (path.length === 4 && path[1] === "api");
    };

    export const detectNamespaceFromPath = function (
        path: string[]) {
        
        if (isValidApiUrl(path)) {
            return path[2];
        }

        return undefined;
    };

    export const detectRoleFromPathAndMethod = function (
        path: string[],
        method: string): ServiceEndpoint.ServiceEndpointRole | undefined {
        
        if (isValidApiUrl(path)) {
            
            // create role url pattern: /api/<nspace>/create
            if (path[3] === "create" && method === "POST") {
                return "create";

                // read role url pattern: /api/<nspace>/read
            } else if (path[3] === "read" && method === "GET") {
                return "read";

                // update role url pattern: /api/<nspace>/update
            } else if (path[3] === "update" && method === "PUT") {
                return "update";

                // delete role url pattern: /api/<nspace>/delete
            } else if (path[3] === "delete" && method === "DELETE") {
                return "delete";
            }
        }

        return undefined;
    };
}