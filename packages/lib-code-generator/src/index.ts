import { AppContract } from "@degenhack/contract-model";


class CodeGeneratorImpl {

    constructor() {

    }

    generateCode(
        contract: AppContract
    ): string {
        const storageFields: Array<string> = [];
        const messageMethods: Array<string> = [];

        /*
        #![cfg_attr(not(feature = "std"), no_std, no_main)]

        #[ink::contract]
        mod ctr {

            #[ink(storage)]
            pub struct Ctr {
                value: bool,
            }

            impl Ctr {
                #[ink(constructor)]
                pub fn new() -> Self {
                    Self { value: false }
                }

                #[ink(message)]
                pub fn flip(&mut self) {
                    self.value = !self.value;
                }

                #[ink(message)]
                pub fn get(&self) -> bool {
                    self.value
                }
            }
        }
        */

        for(let para of contract.paragraphs) {

            storageFields.push(
                `paragraph_${para.index}_completed: bool`
            );

            let provIndex = 0;

            for(let prov of para.provisions) {

                if(prov.type === "REQUIRE_DEPOSIT") {
                    storageFields.push(
                        `storage_deposit_${para.index}_${provIndex}_deposited: bool`
                    );
                    messageMethods.push(
                        `#[ink(message)]\n` +
                        `pub fn deposit_${para.index}_${provIndex}() -> Result<(), Error> {\n` +
                        // Check that caller is the depositor
                        `    if(self.env().caller() != '${prov.payload.depositor}') { Err(Error::NotDepositor) }\n` +
                        // Check that env transferred_value is equal to amount
                        `    if(self.env().transferred_value() != ${prov.payload.amount}) { Err(Error::IncorrectAmount) }\n` +
                        // Check that storage_deposit_${para.index}_${provIndex}_deposited is false
                        `    if(self.storage_deposit_${para.index}_${provIndex}_deposited) { Err(Error::AlreadyDeposited) }\n` +
                        // Set storage_deposit_${para.index}_${provIndex}_deposited to true
                        `    self.storage_deposit_${para.index}_${provIndex}_deposited = true;\n` +
                        `    Ok(())\n` +
                        `}\n`
                    );
                } else if(prov.type === "REQUIRE_SIGNATURE") {
                    storageFields.push(
                        `storage_signature_${para.index}_${provIndex}_signed: bool`
                    );
                    messageMethods.push(
                        `#[ink(message)]\n` +
                        `pub fn sign_${para.index}_${provIndex}() -> Result<(), Error> {\n` +
                        // Check that caller is the signer
                        `    if(self.env().caller() != '${prov.payload.signer}') { Err(Error::NotSigner) }\n` +
                        // Check that storage_signature_${para.index}_${provIndex}_signed is false
                        `    if(self.storage_signature_${para.index}_${provIndex}_signed) { Err(Error::AlreadySigned) }\n` +
                        // Set storage_signature_${para.index}_${provIndex}_signed to true
                        `    self.storage_signature_${para.index}_${provIndex}_signed = true;\n` +
                        `    Ok(())\n` +
                        `}\n`
                    );
                } else if(prov.type === "CREATE_REWARD") {
                    storageFields.push(
                        `storage_reward_${para.index}_${provIndex}_created: bool`
                    );
                    storageFields.push(
                        `storage_reward_${para.index}_${provIndex}_claimed: bool`
                    );
                    messageMethods.push(
                        `#[ink(message)]\n` +
                        `pub fn create_reward_${para.index}_${provIndex}() -> Result<(), Error> {\n` +
                        // Check that storage_reward_${para.index}_${provIndex}_created is false
                        `    if(self.storage_reward_${para.index}_${provIndex}_created) { Err(Error::AlreadyCreated) }\n` +
                        // Set storage_reward_${para.index}_${provIndex}_created to true
                        `    self.storage_reward_${para.index}_${provIndex}_created = true;\n` +
                        `    Ok(())\n` +
                        `}\n`
                    );
                    messageMethods.push(
                        `#[ink(message)]\n` +
                        `pub fn claim_reward_${para.index}_${provIndex}() -> Result<(), Error> {\n` +
                        // Check that storage_reward_${para.index}_${provIndex}_created is true
                        `    if(!self.storage_reward_${para.index}_${provIndex}_created) { Err(Error::NotCreated) }\n` +
                        // Check that storage_reward_${para.index}_${provIndex}_claimed is false
                        `    if(self.storage_reward_${para.index}_${provIndex}_claimed) { Err(Error::AlreadyClaimed) }\n` +
                        // Check that caller is the beneficiary
                        `    if(self.env().caller() != '${prov.payload.beneficiary}') { Err(Error::NotBeneficiary) }\n` +
                        // Set storage_reward_${para.index}_${provIndex}_claimed to true
                        `    self.storage_reward_${para.index}_${provIndex}_claimed = true;\n` +
                        // Transfer reward to beneficiary
                        `    self.env().transfer('${prov.payload.beneficiary}', ${prov.reward});\n` +
                        `    Ok(())\n` +
                        `}\n`
                    );
                }
                
                provIndex++;
    
            }

        }

        return `#![cfg_attr(not(feature = "std"), no_std, no_main)]
        #[ink::contract]
        mod ctr {

            #[ink(storage)]
            pub struct Ctr {
                ${storageFields.join(",\n")}
            }

            impl Ctr {
                #[ink(constructor)]
                pub fn new() -> Self {
                    Self {
                        ${storageFields.map(f => f.split(":")[0]).map(f => `${f}: false`).join(",\n")}
                    }
                }

                ${messageMethods.join("\n")}

            }
        }`;

    }

}

const codeGeneratorInstance = new CodeGeneratorImpl();

export const generateCode = codeGeneratorInstance.generateCode.bind(codeGeneratorInstance);
