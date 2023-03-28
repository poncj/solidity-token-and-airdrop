import { config } from "/config.js";
import { ethers } from "../lib/ethers/ethers-5.7.2.esm.min.js";

export class ModelContractToken {
    constructor(data) {
        this.contract = data.token_contract;
        this.abi = data.token_abi;
        this.signer = data.signer;
    };
}

export class ModelContractAirdrop {
    constructor(data) {
        this.contract = data.airdrop_contract;
        this.abi = data.airdrop_abi;
        this.signer = data.signer;
    };
}

