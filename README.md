# PetProof

PetProof allows pet owners to register pets on the XRP Ledger. Every registered pet receives a unique ID that can be embedded in a microchip or used in a scannable tag.

In the event that a pet is lost and found, the owner's information can be easily retrieved allowing missing pets to reunited with their rightful owners!

Use NFT Devnet credentials, obtained here: [https://xrpl.org/xrp-testnet-faucet.html](https://xrpl.org/xrp-testnet-faucet.html)

Use the account details generated here to register a mock pet!

## About

Every day, pets are lost. Lost pets cause tremendous emotional and economic pain. Shelters are short-staffed and overrun, and the cost of maintaining animals at these shelters can be a huge burden on public funds. PetProof will solve this real world problem by leveraging the power of the XRP Ledger.

PetProof seeks to register pets and their owners on the XRP ledger to help owners relocate their pets if they are ever lost. Using the XRP Ledger, the owner can be verified.

PetProof uses NFTs to create a record of pet ownership. The NFT links to a photo of the pet to help identify, as well as owner contact info. The NFT holder can easily be verified as the rightful owner of their pet.

## Start
 
You will need to add a Web3.storage access token on line 31 in App.js. This can be obtained here: [https://web3.storage/](https://web3.storage/)

Just like any other React app, you can run "npm install" in the project directory, followed by "npm run start" to launch the app. Or simply visit [https://petproof.app](https://petproof.app)

## How it works

This demo is a proof of concept that creates a text file based on owner information, uploads it to IPFS using Web3.storage. Then, the app creates an NFToken on the XRPL. The resulting token ID can be used in an embedded microchip implant, or as a QR code on a wearable tag.

## Future

We want to partner with veterinarians to facilitate our plans to provide microchip IDs. We would also like to provide an API that collar manufacturers can use to incorporate our QR codes in their products.