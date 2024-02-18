export type AppContractParagraphProvisionType =
    "REQUIRE_DEPOSIT"
    | "REQUIRE_SIGNATURE"
    | "CREATE_REWARD";

export interface AppContractMember {
    address: string;
    name: string;
}

export type AppContractRequireDepositProvisionPayload = {
    depositor: string;
    amount: number;
    notes: string;
}

export type AppContractRequireSignatureProvisionPayload = {
    signer: string;
    notes: string;
}

export type AppContractCreateRewardProvisionPayload = {
    reward: number;
    notes: string;
}

export interface AppContractParagraphRequireDepositProvision {
    type: "REQUIRE_DEPOSIT";
    payload: AppContractRequireDepositProvisionPayload;
}

export interface AppContractParagraphRequireSignatureProvision {
    type: "REQUIRE_SIGNATURE";
    payload: AppContractRequireSignatureProvisionPayload;
}

export interface AppContractParagraphCreateRewardProvision {
    type: "CREATE_REWARD";
    payload: AppContractCreateRewardProvisionPayload;
}

export type AppContractParagraphProvision =
    AppContractParagraphRequireDepositProvision
    | AppContractParagraphRequireSignatureProvision
    | AppContractParagraphCreateRewardProvision;

export interface AppContractParagraph {
    id: string;
    title: string;
    index: number;
    deadline: number;
    provisions: Array<AppContractParagraphProvision>;
    dependsOn: Array<string>;
}

export interface AppContractDeployment {
    address: string;
}

export interface AppContract {
    id: string;
    title: string;
    members: Array<AppContractMember>;
    paragraphs: Array<AppContractParagraph>;
    deployment?: AppContractDeployment;
}

export interface AppContact {
    name: string;
    address: string;
}
