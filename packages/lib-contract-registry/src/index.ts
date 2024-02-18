import { AppContact, AppContract } from "../../contract-model/src";

const CONTRACT_REGISTRY_KEY = "contracter.contractRegistry";

class ContractRegistryImpl {

    private _contracts: Array<AppContract> = [];

    constructor() {

        const persistedData = localStorage.getItem(CONTRACT_REGISTRY_KEY);
        if (persistedData) {
            this._contracts = JSON.parse(persistedData);
        }

    }

    private async flush() {
        localStorage.setItem(CONTRACT_REGISTRY_KEY, JSON.stringify(this._contracts));
    }

    public async listContracts(): Promise<Array<AppContract>> {
        return this._contracts;
    }

    public async createContract(
        newContract: AppContract
    ): Promise<void> {
        const newContractId = Math.random().toString(36).substring(7) + `${new Date().getTime()}`;
        const toSave = Object.assign({}, newContract, { id: newContractId });
        this._contracts.push(toSave);
        await this.flush();
    }

    public async deleteContract(
        id: string
    ): Promise<void> {
        this._contracts = this._contracts.filter(
            contract => contract.id !== id
        );

        await this.flush();
    }

    public async updateContract(
        updatedContract: AppContract
    ): Promise<void> {
        const existingContractIndex = this._contracts.findIndex(
            contract => contract.id === updatedContract.id
        );

        if (existingContractIndex !== -1) {
            this._contracts[existingContractIndex] = updatedContract;
        }

        await this.flush();
    }

}

const contractRegistryInstance = new ContractRegistryImpl();

export const listContracts = contractRegistryInstance.listContracts.bind(contractRegistryInstance);
export const createContract = contractRegistryInstance.createContract.bind(contractRegistryInstance);
export const deleteContract = contractRegistryInstance.deleteContract.bind(contractRegistryInstance);
export const updateContract = contractRegistryInstance.updateContract.bind(contractRegistryInstance);
