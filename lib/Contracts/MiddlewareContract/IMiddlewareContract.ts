import { IRoutingContract } from "../RoutingContract";
import { MiddlewareContractAfterExecFunctionType } from "./MiddlewareContractAfterExecFunctionType";
import { MiddlewareContractBeforeExecFunctionType } from "./MiddlewareContractBeforeExecFunctionType";

export interface IMiddlewareContract extends IRoutingContract {
    before: MiddlewareContractBeforeExecFunctionType;
    after?: MiddlewareContractAfterExecFunctionType;
}