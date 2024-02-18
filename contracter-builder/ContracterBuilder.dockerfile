FROM rust:latest

RUN apt update
RUN apt install nodejs npm build-essential git clang curl libssl-dev llvm libudev-dev make protobuf-compiler -y --fix-missing

RUN curl -L https://github.com/paritytech/substrate-contracts-node/releases/download/v0.35.0/substrate-contracts-node-linux.tar.gz > substrate-contracts-node-linux.tar.gz
RUN tar -xvzf substrate-contracts-node-linux.tar.gz
RUN mv ./artifacts/substrate-contracts-node-linux/substrate-contracts-node /usr/bin

# RUN rustup default stable && rustup update
# RUN rustup update nightly && rustup target add wasm32-unknown-unknown --toolchain nightly
# RUN rustup show
# RUN rustup +nightly show
#
# RUN cargo install contracts-node

RUN rustup component add rust-src
RUN cargo install --force --locked cargo-contract

WORKDIR /app
COPY server.js /app
COPY package.json /app
COPY package-lock.json /app
COPY template /app/template

RUN npm install

ENTRYPOINT ["node", "server.js"]
