
import { ethers } from "../lib/ethers/ethers-5.7.2.esm.min.js";
import { config } from "/config.js";

export async function getContractData() {

    let token_abi = await fetch("./TokenTeam26v2_sol_TokenTeam26.abi");
    token_abi = await token_abi.text();
    let airdrop_abi = await fetch("./AirdropTokenTeam26v2_sol_AirdropTokenTeam26.abi");
    airdrop_abi = await airdrop_abi.text();

    const contractData = {
        token_abi: token_abi,
        airdrop_abi: airdrop_abi,
        signer: false,
        token_contract: false,
        airdrop_contract: false,
        provider: false
    }

    // contractData.provider = new ethers.providers.JsonRpcProvider(config.RPC_URL);
    // contractData.signer = new ethers.Wallet(config.PRIVATE_KEY, contractData.provider);
    // contractData.contract = new ethers.Contract(config.CONTRACT_ADDRESS, contractData.abi, contractData.signer);

    /*
        ganache JsonRpcProvider
        when deployed to productin blockchain use Web3Provider:
        
        web3 production
    */
    contractData.provider = new ethers.providers.Web3Provider(window.ethereum, config.TESTNET_ID); //id
    let listAccounts = await contractData.provider.send("eth_requestAccounts", []);
    let signer = await contractData.provider.getSigner(listAccounts[0]);
    signer.address = await signer.getAddress(); // could couse problems later
    contractData.signer = signer
    contractData.token_contract = await new ethers.Contract(config.TOKEN_CONTRACT_ADDRESS, contractData.token_abi, contractData.signer);
    contractData.airdrop_contract = await new ethers.Contract(config.AIRDROP_CONTRACT_ADDRESS, contractData.airdrop_abi, contractData.signer);

    return Object.freeze(contractData);
}


