import { ContractMapper } from "../ContractMapper";

export abstract class ContractServer extends ContractMapper {
    public abstract listen(port: number): Promise<void>;
}