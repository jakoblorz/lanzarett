import { EndpointContractRoleType } from "./EndpointContractRoleType";
import { EndpointContractFunction } from "./EndpointContractFunction";
import { IMiddlewareContract } from "../MiddlewareContract/IMiddlewareContract";
import { IRoutingContract } from "../RoutingContract";

export interface IEndpointContract extends IRoutingContract {
    role: EndpointContractRoleType;
    function: EndpointContractFunction;
    middleware: IMiddlewareContract[];
}