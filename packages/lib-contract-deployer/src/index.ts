import { CodePromise } from "@polkadot/api-contract";
import { BN } from "@polkadot/util";


const AUTH_KEY = "contracter.auth";

class ContractDeployerImpl {

    private _rpcUrl: string = "";
    private _deployerAddress: string = "";

    constructor() {

        const persistedAuthData = localStorage.getItem(AUTH_KEY);
        if (persistedAuthData) {
            const authData = JSON.parse(persistedAuthData);
            this._rpcUrl = authData.network;
            this._deployerAddress = authData.address;
        }

    }

    async deployContract(
        bundleData: any
    ): Promise<string> {

        // @ts-ignore
        const api = window.DegenWeb3Init.api();
        // @ts-ignore
        const injector = window.DegenWeb3Init.injector();

        const gasLimit = api.registry.createType("WeightV2", {
            refTime: new BN("2000000000"),
            proofSize: new BN("200000"),
        });
        const storageDepositLimit = null;

        const promise = new Promise<string>(
            async (resolve, reject) => {
                
                const code = new CodePromise(
                    api,
                    bundleData,
                    bundleData.source.wasm
                );
                const tx = code.tx.new({
                    gasLimit,
                    storageDepositLimit,
                }, false); // false is for flipper POC contract
                
                const unsub = await tx.signAndSend(
                    this._deployerAddress,
                    { signer: injector.signer },
                    // @ts-ignore
                    ({ contract, status }) => {
                        if(status.isInBlock) {
                            unsub();
                            resolve(contract.address.toString());
                        }
                    }
                )

            }
        );

        return await promise;

    }

}

const contractDeployerInstance = new ContractDeployerImpl();

export const deployContract = contractDeployerInstance.deployContract.bind(contractDeployerInstance);
