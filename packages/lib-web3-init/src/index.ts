import { ApiPromise, WsProvider } from "@polkadot/api";
import { CodePromise, ContractPromise } from "@polkadot/api-contract";
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';

const WEB3_APP_NAME = "Contracter";
const AUTH_KEY = "contracter.auth";

const RPC_URLS = [
    {
        name: "Polkadot via Dwellir",
        url: "wss://polkadot-rpc.dwellir.com"
    },
    {
        name: "Aleph Zero via Aleph Zero Foundation",
        url: "wss://ws.azero.dev"
    },
    {
        name: "Local Node",
        url: "ws://127.0.0.1:9944"
    }
];

class Web3InitImpl {

    private _api: ApiPromise | null = null;
    private _wsProvider: WsProvider | null = null;
    private _injected: Array<any> = [];
    private _allAccounts: Array<any> = [];
    private _selectedAccount: any | null = null;
    private _injector: any | null = null;
    private _initializedOne: boolean = false;
    private _initializedTwo: boolean = false;
    private _rpcUrl: string = "";

    constructor() {

        const persistedAuthData = localStorage.getItem(AUTH_KEY);
        if (persistedAuthData) {
            const authData = JSON.parse(persistedAuthData);
            this._selectedAccount = authData.address;
            this._rpcUrl = authData.network;
        }

    }

    public async initOne() {
        if (this._initializedOne) {
            return;
        }

        this._injected = await web3Enable(WEB3_APP_NAME);
        this._allAccounts = await web3Accounts();

        this._initializedOne = true;
    }

    public async initTwo() {
        if (this._initializedTwo) {
            return;
        }

        this._wsProvider = new WsProvider(this._rpcUrl);
        this._api = await ApiPromise.create({ provider: this._wsProvider });
        this._injector = await web3FromAddress(this._selectedAccount);

        this._initializedTwo = true;
    }

    public async runWithWeb3(
        cb: () => any,
        noAccountCb: () => any
    ): Promise<any> {
        try {
            await this.initOne();
            if (!this._selectedAccount) {
                const accountResult = await noAccountCb();
                if (typeof accountResult === "object") {
                    this._selectedAccount = accountResult.address;
                    this._rpcUrl = accountResult.network;
                }
            }
            if (!this._selectedAccount) {
                alert("No account selected, cannot continue.");
                return;
            }
            await this.initTwo();
            return await cb();
        } catch (e) {
            console.error(e);
            alert("Fatal error, see console for details.");
        }
    }

    public api() {
        return this._api;
    }

    public injector() {
        return this._injector;
    }

    public accounts() {
        return this._allAccounts;
    }

    public networks() {
        return RPC_URLS;
    }

}

const web3InitInstance = new Web3InitImpl();

export const initOne = web3InitInstance.initOne.bind(web3InitInstance);
export const initTwo = web3InitInstance.initTwo.bind(web3InitInstance);
export const api = web3InitInstance.api.bind(web3InitInstance);
export const injector = web3InitInstance.injector.bind(web3InitInstance);
export const accounts = web3InitInstance.accounts.bind(web3InitInstance);
export const networks = web3InitInstance.networks.bind(web3InitInstance);
export const runWithWeb3 = web3InitInstance.runWithWeb3.bind(web3InitInstance);
