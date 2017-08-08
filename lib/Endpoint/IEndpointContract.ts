import { EndpointContractRoleType } from "./EndpointContractRoleType";
import { EndpointContractFunction } from "./EndpointContractFunction";
import { IMiddlewareContract } from "../contract/MiddlewareContract";
import { IRoutingContract } from "../contract/RoutingContract";

export interface IEndpointContract extends IRoutingContract {
    role: EndpointContractRoleType;
    function: EndpointContractFunction;
    middleware: IMiddlewareContract[];
}