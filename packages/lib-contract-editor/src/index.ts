

const EDITOR_CONTRACT_KEY = "contracter.contractEditorContract";

class ContractEditorImpl {

    private _contract: any | null = null;

    constructor() {

        const persistedData = localStorage.getItem(EDITOR_CONTRACT_KEY);
        if (persistedData) {
            this._contract = JSON.parse(persistedData);
        } else {
            this._contract = {
                title: "Untitled contract",
                members: [],
                paragraphs: []
            }
        }

    }

    private async flush() {
        localStorage.setItem(EDITOR_CONTRACT_KEY, JSON.stringify(this._contract));
    }

    public getContract(): any {
        return this._contract;
    }

    public async saveContract(
        contract: any
    ): Promise<void> {
        this._contract = contract;
        await this.flush();
    }

}

const contractEditorInstance = new ContractEditorImpl();

export const getWIPContract = contractEditorInstance.getContract.bind(contractEditorInstance);
export const saveWIPContract = contractEditorInstance.saveContract.bind(contractEditorInstance);
