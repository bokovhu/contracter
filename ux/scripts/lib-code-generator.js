var DegenCodeGenerator=(()=>{var i=Object.defineProperty;var l=Object.getOwnPropertyDescriptor;var p=Object.getOwnPropertyNames;var f=Object.prototype.hasOwnProperty;var $=(t,o)=>{for(var n in o)i(t,n,{get:o[n],enumerable:!0})},g=(t,o,n,a)=>{if(o&&typeof o=="object"||typeof o=="function")for(let e of p(o))!f.call(t,e)&&e!==n&&i(t,e,{get:()=>o[e],enumerable:!(a=l(o,e))||a.enumerable});return t};var c=t=>g(i({},"__esModule",{value:!0}),t);var E={};$(E,{generateCode:()=>u});var d=class{constructor(){}generateCode(o){let n=[],a=[];for(let e of o.paragraphs){n.push(`paragraph_${e.index}_completed: bool`);let r=0;for(let s of e.provisions)s.type==="REQUIRE_DEPOSIT"?(n.push(`storage_deposit_${e.index}_${r}_deposited: bool`),a.push(`#[ink(message)]
pub fn deposit_${e.index}_${r}() -> Result<(), Error> {
    if(self.env().caller() != '${s.payload.depositor}') { Err(Error::NotDepositor) }
    if(self.env().transferred_value() != ${s.payload.amount}) { Err(Error::IncorrectAmount) }
    if(self.storage_deposit_${e.index}_${r}_deposited) { Err(Error::AlreadyDeposited) }
    self.storage_deposit_${e.index}_${r}_deposited = true;
    Ok(())
}
`)):s.type==="REQUIRE_SIGNATURE"?(n.push(`storage_signature_${e.index}_${r}_signed: bool`),a.push(`#[ink(message)]
pub fn sign_${e.index}_${r}() -> Result<(), Error> {
    if(self.env().caller() != '${s.payload.signer}') { Err(Error::NotSigner) }
    if(self.storage_signature_${e.index}_${r}_signed) { Err(Error::AlreadySigned) }
    self.storage_signature_${e.index}_${r}_signed = true;
    Ok(())
}
`)):s.type==="CREATE_REWARD"&&(n.push(`storage_reward_${e.index}_${r}_created: bool`),n.push(`storage_reward_${e.index}_${r}_claimed: bool`),a.push(`#[ink(message)]
pub fn create_reward_${e.index}_${r}() -> Result<(), Error> {
    if(self.storage_reward_${e.index}_${r}_created) { Err(Error::AlreadyCreated) }
    self.storage_reward_${e.index}_${r}_created = true;
    Ok(())
}
`),a.push(`#[ink(message)]
pub fn claim_reward_${e.index}_${r}() -> Result<(), Error> {
    if(!self.storage_reward_${e.index}_${r}_created) { Err(Error::NotCreated) }
    if(self.storage_reward_${e.index}_${r}_claimed) { Err(Error::AlreadyClaimed) }
    if(self.env().caller() != '${s.payload.beneficiary}') { Err(Error::NotBeneficiary) }
    self.storage_reward_${e.index}_${r}_claimed = true;
    self.env().transfer('${s.payload.beneficiary}', ${s.reward});
    Ok(())
}
`)),r++}return`#![cfg_attr(not(feature = "std"), no_std, no_main)]
        #[ink::contract]
        mod ctr {

            #[ink(storage)]
            pub struct Ctr {
                ${n.join(`,
`)}
            }

            impl Ctr {
                #[ink(constructor)]
                pub fn new() -> Self {
                    Self {
                        ${n.map(e=>e.split(":")[0]).map(e=>`${e}: false`).join(`,
`)}
                    }
                }

                ${a.join(`
`)}

            }
        }`}},_=new d,u=_.generateCode.bind(_);return c(E);})();
//# sourceMappingURL=index.js.map
