import Web3 from 'web3';
 import { create } from 'ipfs-http-client';
 import EHRContract from '../build/contracts/EHR.json';
 const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
async function connectBlockchain() {
 const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
 const accounts = await web3.eth.requestAccounts();
 document.getElementById("account").innerText = accounts[0];
 }
 window.onload = connectBlockchain;

import Web3 from 'web3';
 import { create } from 'ipfs-http-client';
 import EHRContract from './build/contracts/EHR.json'; // Path to the compiled 
contract
 // Create an instance of IPFS to upload files
 const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
 // Connect to Ethereum via MetaMask or Ganache
 let web3;
 let contract;
 let accounts;
 async function connectBlockchain() {
    // Create web3 instance (will use MetaMask's provider or Ganache if MetaMask is not available)
    web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
    // Request access to MetaMask accounts
    accounts = await web3.eth.requestAccounts();
    // Display the connected account
    document.getElementById("account").innerText = accounts[0];
    // Load the deployed contract (using the ABI and contract address)
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = EHRContract.networks[networkId];
    contract = new web3.eth.Contract(
        EHRContract.abi,
        deployedNetwork && deployedNetwork.address
    );
 }
 // Call this when the page loads
 window.onload = connectBlockchain;

 // Function to upload a medical record
 async function uploadRecord() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    if (!file) {
        alert("Please select a file to upload");
        return;
    }
    // Upload the file to IPFS
    const added = await ipfs.add(file);
    const ipfsHash = added.path; // Get the file's IPFS hash
    // Call the smart contract to add the record with the IPFS hash
    await contract.methods.addRecord(ipfsHash).send({ from: accounts[0] });
    // Display the uploaded record in the list
    displayRecords();
 }

 // Function to display the records for the connected account
 async function displayRecords() {
    const records = await contract.methods.getRecords().call({ from: accounts[0] });
    const recordsList = document.getElementById("recordsList");
    recordsList.innerHTML = ''; // Clear existing records list
    // Display each record
    records.forEach(record => {
        const li = document.createElement("li");
        li.innerText = `Record: ${record.ipfsHash}`;
        recordsList.appendChild(li);
    });
 }



// Enhanced
async function displayRecords() {
    const records = await contract.methods.getRecords().call({ from: accounts[0] });
    const recordsList = document.getElementById("recordsList");
    recordsList.innerHTML = '';  // Clear existing records list
    if (records.length === 0) {
        recordsList.innerHTML = "<li>No records found</li>";
    } else {
        records.forEach(record => {
            const li = document.createElement("li");
            li.innerHTML = `Record: <a 
href="https://ipfs.infura.io/ipfs/${record.ipfsHash}" 
target="_blank">${record.ipfsHash}</a>`;
            recordsList.appendChild(li);
        });
    }
 }

  // Function to add a doctor
  async function addDoctor() {
    const doctorAddress = document.getElementById("doctorAddress").value;
    await contract.methods.addDoctor(doctorAddress).send({ from: accounts[0] });
    alert("Doctor added successfully");
 }
 // Function to fetch a specific patient's records
 async function fetchPatientRecords() {
    const patientAddress = document.getElementById("patientAddress").value;
    const records = await contract.methods.getPatientRecords(patientAddress).call({ 
from: accounts[0] });
    const recordsList = document.getElementById("recordsList");
    recordsList.innerHTML = '';  // Clear the records list
    if (records.length === 0) {
        recordsList.innerHTML = "<li>No records found for this patient</li>";
    } else {
        records.forEach(record => {
            const li = document.createElement("li");
            li.innerHTML = `Record: <a 
href="https://ipfs.infura.io/ipfs/${record.ipfsHash}" 
target="_blank">${record.ipfsHash}</a>`;
            recordsList.appendChild(li);
        });
    }
 }


 import CryptoJS from 'crypto-js';
 async function uploadEncryptedRecord() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
    if (!file) {
        alert("Please select a file to upload");
        return;
    }
     // Convert the file to base64
     const reader = new FileReader();
     reader.onloadend = async function () {
         const fileData = reader.result;
         // Encrypt the file data
         const encrypted = CryptoJS.AES.encrypt(fileData, 'secret-key').toString();
         // Upload the encrypted file to IPFS
         const added = await ipfs.add(encrypted);
         const ipfsHash = added.path;
         // Store the IPFS hash in the smart contract
         await contract.methods.addRecord(ipfsHash).send({ from: accounts[0] });
         // Display the uploaded record
         displayRecords();
     };
     reader.readAsDataURL(file);
  }


  async function decryptRecord(ipfsHash) {
    // Fetch the encrypted data from IPFS
    const encryptedData = await ipfs.cat(ipfsHash);
    // Decrypt the data using the same secret key
    const decrypted = CryptoJS.AES.decrypt(encryptedData.toString(), 'secret-key');
    const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);
    console.log("Decrypted Data:", decryptedData);
 }