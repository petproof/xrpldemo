import './App.css';
import React, { useState } from 'react';
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js'
import QRCode from 'react-qr-code';
import loadingImg from './loading.gif';


const xrpl = require("xrpl");
var tokensCreated = 0;
var ipfsID;
var txID;
var finalTokenID;
var showResults = 0;

function App() {

  const [results,setResults] = useState('');
  const [account, setAccount] = useState('');
  const [secret, setSecret] = useState('');
  const [tokenUrl, settokenUrl] = useState('');
  const [flags, setFlags] = useState('8');
  const [tokenId, settokenId] = useState('');
  const [petName, setpetName] = useState('');
  const [tokenOfferIndex, settokenOfferIndex] = useState('');
  const [contactInfo, setcontactInfo] = useState('');
  const [contactInfoPhone, setcontactInfoPhone] = useState('');
  const [contactInfoEmail, setcontactInfoEmail] = useState('');
  const [finalQR,setfinalQR] = useState('');
  
  function getAccessToken () {
    return 'ADD YOUR API KEY HERE FOR Web3.Storage'
  }

  function makeStorageClient () {
    return new Web3Storage({ token: getAccessToken() })
  }
  
  function makeFileObjects () {
    setResults('<p>Creating file for '+petName+' and uploading to IPFS...</p><img id="loadingImg" src="'+loadingImg.toString()+'" />');
    const obj = { petName: petName, ownerName: contactInfo, ownerPhone: contactInfoPhone, ownerEmail: contactInfoEmail }
    const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' })

    const files = [
      new File([blob], 'pet.json')
    ]
    return files
  }
  
  async function storeWithProgress (files) {
    // show the root cid as soon as it's ready
    const onRootCidReady = cid => {
      console.log('uploading files with cid:', cid)
      ipfsID = cid;
    }
    
    

    // when each chunk is stored, update the percentage complete and display
    const totalSize = files.map(f => f.size).reduce((a, b) => a + b, 0)
    let uploaded = 0

    const onStoredChunk = size => {
      uploaded += size
      const pct = 100 * (uploaded / totalSize)
      console.log(`Uploading... ${pct.toFixed(2)}% complete`)
    }

    // makeStorageClient returns an authorized Web3.Storage client instance
    const client = makeStorageClient()

    // client.put will invoke our callbacks during the upload
    // and return the root cid when the upload completes
    return client.put(files, { onRootCidReady, onStoredChunk })
  }


async function createTokens() {
    showResults = 1;
    const myFiles = makeFileObjects();
    storeWithProgress(myFiles);

    const wallet = xrpl.Wallet.fromSeed(secret);
  	const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233");
  	await client.connect();
  	console.log("Connected to Sandbox");


    const Note = 'Name: '+petName+' / Owner: '+contactInfo;
  	const transactionBlob = {
  		TransactionType: "NFTokenMint",
  		Account: wallet.classicAddress,
  		URI: xrpl.convertStringToHex(ipfsID),
  		Flags: 8,
      Memos: [
        {
          Memo: {
            MemoType: Buffer.from('Note', 'utf8').toString('hex').toUpperCase(),
            MemoData: Buffer.from(Note, 'utf8').toString('hex').toUpperCase()
          }
        }
      ],
  		NFTokenTaxon: 0 //Required, but if you have no use for it, set to zero.
  	}

    let currentStep = 1;

    setResults('<p>Registering '+petName+' on the ledger...</p><img id="loadingImg" src="'+loadingImg.toString()+'" />');
    let tx = await client.submitAndWait(transactionBlob,{wallet})
    let nfts = await client.request({
    		method: "account_nfts",
    		account: wallet.classicAddress
    })
    currentStep++;
    console.log(nfts)
    console.log("Transaction result:", tx.result.meta.TransactionResult)
    console.log(tx.result.hash)
    txID = tx.result.hash
    console.log("Balance changes:",
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))



    // Get tokens
  	nfts = await client.request({
  		method: "account_nfts",
  		account: wallet.classicAddress
  	})
    console.log('NFTs list');
  	console.log(nfts);

    let tokenIdList = [];
    let sellOffersFinalList = [];

    tokenIdList.push( nfts.result.account_nfts[0].NFTokenID );

    console.log('Id list');
    console.log(tokenIdList);

    console.log(tokenIdList[0]);

    // Create sell offers
    currentStep = 1;
  

    // Post results
    let tokenListHTML = '';
    
    //tokenListHTML = tokenListHTML + '<p>Token ID: '+tokenIdList[0]+'</p>';
    setfinalQR(tokenIdList[0]);
    finalTokenID = tokenIdList[0];
    
    showResults = 2;
    setResults('<p>Success! You have registered your pet:</p><p><a href="https://nft-devnet.xrpl.org/transactions/'+txID+'" target="_blank">See your record on the ledger.</a></p>'+tokenListHTML);

  	client.disconnect()
}

/*
function uploadText(){
  
  const myFiles = makeFileObjects();
  storeWithProgress(myFiles);
  
}
*/


  return (
    <div className="App">
      <img src="https://cdn.glitch.global/6d37b72e-c736-4252-8799-79e41ff618f9/logo.png?v=1661035187142" className="logoImg" />
      
      
      <div className="formArea">
       
       {showResults < 1 &&
        <form id="theForm">
            
          <p>PetProof allows pet owners to register pets on the XRP Ledger. Every registered pet receives a unique ID that can be embedded in a microchip or used in a scannable tag.</p>
          <p>In the event that a pet is lost and found, the owner's information can be easily retrieved allowing missing pets to reunited with their rightful owners!</p>

            <h2>Try it Out!</h2>

            <p>Our demo currently runs on the XRPL NFT-Devnet.</p>
            <p>You'll need to first <a target="_blank" href="https://xrpl.org/xrp-testnet-faucet.html">grab your credentials here</a>. Make sure you click on the button that says "Generate NFT-Devnet Credentials"</p>
            <p>*Note: in the production version, you will be able to connect your XUMM wallet to interact with the app.</p>
            <div className="formContainer">
            <p>XRP Credentials - Account Address<br/>
            <input type="text" id="account" value={account} onInput={e => setAccount(e.target.value)} size="40" />
            </p>

            <p>XRP Credentials - Secret<br/>
            <input type="text" id="secret" value={secret} onInput={e => setSecret(e.target.value)} size="40" />
            </p>

            <p>Photo of Pet<br/>
            <input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" />
            </p>

            <p>Name of Pet<br/>
            <input type="text" id="petName" value={petName} onInput={e => setpetName(e.target.value)} size="40"/>
            </p>

            <p>Owner Name<br/>
            <input type="text" id="contactInfo" value={contactInfo} onInput={e => setcontactInfo(e.target.value)} size="80"/>
            </p>

            <p>Owner Phone Number<br/>
            <input type="text" id="contactInfoPhone" value={contactInfoPhone} onInput={e => setcontactInfoPhone(e.target.value)} size="80"/>
            </p>

            <p>Owner Email<br/>
            <input type="text" id="contactInfoEmail" value={contactInfoEmail} onInput={e => setcontactInfoEmail(e.target.value)} size="80"/>
            </p>

            <p><button type="button" onClick={createTokens}>Register Pet</button></p>
            
              
            </div>
        </form>
        }
        
      </div>
      <div className="resultsArea">
        <div dangerouslySetInnerHTML={{__html: results }} /><br />
        {showResults === 2 &&
         <div>
         <h2>Next Steps</h2>
         <ol>
           <li>Take the Token ID to your vet to be used in a microchip implant.</li>
           <li>Or, the Token ID can be used as a QR code which can be engraved on a wearable tag. Download your QR code below.</li>
         </ol>
         <QRCode value={finalQR} />
         <p>Token ID for {petName} is:<br/> {finalTokenID}</p>
         </div>
        }
      </div>
    </div>
  );
}

export default App;
