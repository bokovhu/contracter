var DegenContractEditor=(()=>{var o=Object.defineProperty;var l=Object.getOwnPropertyDescriptor;var h=Object.getOwnPropertyNames;var p=Object.prototype.hasOwnProperty;var g=(c,t)=>{for(var n in t)o(c,n,{get:t[n],enumerable:!0})},u=(c,t,n,e)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of h(t))!p.call(c,a)&&a!==n&&o(c,a,{get:()=>t[a],enumerable:!(e=l(t,a))||e.enumerable});return c};var C=c=>u(o({},"__esModule",{value:!0}),c);var v={};g(v,{getWIPContract:()=>_,saveWIPContract:()=>d});var i="contracter.contractEditorContract",s=class{_contract=null;constructor(){let t=localStorage.getItem(i);t?this._contract=JSON.parse(t):this._contract={title:"Untitled contract",members:[],paragraphs:[]}}async flush(){localStorage.setItem(i,JSON.stringify(this._contract))}getContract(){return this._contract}async saveContract(t){this._contract=t,await this.flush()}},r=new s,_=r.getContract.bind(r),d=r.saveContract.bind(r);return C(v);})();
//# sourceMappingURL=index.js.map