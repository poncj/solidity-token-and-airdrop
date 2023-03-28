// FOR NODE.JS ONLY

const ethers = require("ethers");
const fs = require("fs");
require('dotenv').config();

const abi = fs.readFileSync("./AirdropTokenTeam26v2_sol_AirdropTokenTeam26.abi", "utf-8");
const bin = fs.readFileSync("./AirdropTokenTeam26v2_sol_AirdropTokenTeam26.bin", "utf-8");

async function deploy() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const account = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contractFactory = new ethers.ContractFactory(abi, bin, account);
    const contract = await contractFactory.deploy(process.env.TOKEN_CONTRACT_ADDRESS);
    const contractReceipt = await contract.deployTransaction.wait();
    
    console.log(`Airdrop address: ${contract.address}`);
}

deploy().then(() => process.exit(0)).catch((error) => {
    console.log(error);
    process.exit(1);
});

