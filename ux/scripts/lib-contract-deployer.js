var DegenContractDeployer=(()=>{var n=Object.defineProperty;var i=Object.getOwnPropertyDescriptor;var p=Object.getOwnPropertyNames;var l=Object.prototype.hasOwnProperty;var u=(e,t)=>{for(var r in t)n(e,r,{get:t[r],enumerable:!0})},d=(e,t,r,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of p(t))!l.call(e,o)&&o!==r&&n(e,o,{get:()=>t[o],enumerable:!(s=i(t,o))||s.enumerable});return e};var y=e=>d(n({},"__esModule",{value:!0}),e);var h={};u(h,{deployContract:()=>m});var g="contracter.auth",a=class{_rpcUrl="";constructor(){let t=localStorage.getItem(g);if(t){let r=JSON.parse(t);this._rpcUrl=r.network}}async deployContract(t){return await new Promise((s,o)=>{setTimeout(()=>o("Not yet supported"),1e3)})}},c=new a,m=c.deployContract.bind(c);return y(h);})();
//# sourceMappingURL=index.js.map