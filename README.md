# Contracter

![logo image](./logo.png)

_Contracter is a web3 application, that allows users to create contracts using a simple user interface, and interact with them as well. The created contracts may support many interesting financial features, such as requiring a deposit, or sending a reward to someone._

* [YouTube Video](#)
* [Live Demo](https://contracter-degenhack-2024-ux.surge.sh)

# Screenshots

![the landing page](screenshots/landing-page.png)

![the contract editor](screenshots/contract-editor.png)

![build & deploy contract](screenshots/build-deploy.png)

![build was successful](screenshots/build-successful.png)

![deploy contract](screenshots/deploy-contract.png)

![success deploying contract](screenshots/success-deploy.png)

![the contact book](screenshots/contact-book.png)

![the login screen](screenshots/login.png)

![polkadot js login](screenshots/polkadot-js-login.png)

# Development

Source code in this repository is structured as follows:

* `ux/` - contains the current user interface (started as a UX prototype). It consumes the `lib-*` packages in standalone `.html` files, that can be served as-is. These micro-frontend applications make up the UI for now.
* `packages/*` - various packages in an NPM mono-repository. Most importantly, here reside the `lib-*` packages, which are built as _IIFE bundles_, and exported as global variables when included in an HTML page.
    * `lib-contact-book/`, `lib-contract-registry/`, `lib-contract-deployer/`, `lib-contract-editor/`, `lib-web3-init`
    * `video-generator/` - a python-based OpenAI video generator thingy
* `contracter-builder/` - the "contract compiler server" - a container that includes the build tooling necessary to build smart contracts, and a web service for exposing building functionality (returns WASM + ABI JSON contract bundle).

To recompile the IIFE libraries, run `npm run -w @degenhack/lib-contact-book build` (or any other package name).

To serve the UX prototype, run `npm run -w @degenhack/ux start`

To build the contracter-builder, run `docker build -t contracter-builder:latest -f ContracterBuilder.Dockerfile contracter-builder/`
