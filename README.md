# Assignment 3 | TokenTeam26 & Airdrop

## How to use

Everything in the /deploy/ folder is intended to be used on local machine.

Everything in the /production/ folder is intended to be uploaded to the hosting.

So for a successful installation, we must first deploy the contracts, and then upload the files from the production folder to the hosting.

### How to /deploy/ contracts

1. Download full repository to your local machine.

2. Open /deploy/ folder via VS Code

3. In the .env file, specify your PRIVATE_KEY from which the contracts will be deployed.

3. Also specify RPC_URL in the .env file.

3. Open terminal and start to execute commands:

This command will install all the libraries needed to deploy the contracts

```bash
npm i
```

4. Type next command. It will deploy the token contract.

```bash
node deployToken.js
```

4. Аfter executing the previous command in the terminal we should see the address of the token. You must copy this address and specify it in your .env as TOKEN_CONTRACT_ADDRESS.

5. Type next command. It will deploy the airdrop contract.

```bash
node deployAirdrop.js
```

6. Аfter executing the previous command in the terminal we should see the address of the airdrop contract. You must copy this address and specify it in your .env as AIRDROP_CONTRACT_ADDRESS.

This is where the deployment of contracts ends. Now we need to configure the files of the /production/ folder.

### How to configure /production/


