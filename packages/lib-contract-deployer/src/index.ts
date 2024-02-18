
const AUTH_KEY = "contracter.auth";

class ContractDeployerImpl {

    private _rpcUrl: string = "";

    constructor() {

        const persistedAuthData = localStorage.getItem(AUTH_KEY);
        if (persistedAuthData) {
            const authData = JSON.parse(persistedAuthData);
            this._rpcUrl = authData.network;
        }

    }

    async deployContract(
        bundleData: any
    ): Promise<string> {

        const promise = new Promise<string>(
            (resolve, reject) => {
                setTimeout(
                    () => reject("Not yet supported"),
                    1000
                );
            }
        );

        return await promise;

    }

}

const contractDeployerInstance = new ContractDeployerImpl();

export const deployContract = contractDeployerInstance.deployContract.bind(contractDeployerInstance);
