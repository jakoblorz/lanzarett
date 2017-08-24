import { ServiceEndpointResponse } from "./ServiceEndpointResponse";

export namespace ServiceEndpoint {

    /**
     * there are 4 types of endpoints: create, read, update and deleted typed endpoints;
     * each process data in a manner following their role
     */
    export type ServiceEndpointRole = "create" | "read" | "update" | "delete";

    /**
     * describes a basic function endpoint
     */
    export interface IServiceEndpoint<T> {

        /**
         * name of this endpoint function
         */
        name: string;

        /**
         * namespace of this endpoint function
         */
        namespace: "*" | string;

        /**
         * arguments of this endpoint function
         * in the right order
         */
        args: string[];

        /**
         * crud-role definition of this endpoint
         * function
         */
        role: ServiceEndpointRole;

        /**
         * sample response of this endpoint function
         */
        sample: T;

        /**
         * actual function that will be called
         */
        callback: (...args: any[]) => Promise<ServiceEndpointResponse.IServiceEndpointResponse>;
    }
}
