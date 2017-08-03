import { ContractMapper } from "../ContractMapper";

export abstract class ContractServer extends ContractMapper {
    public abstract start(port: number): Promise<void>;
}