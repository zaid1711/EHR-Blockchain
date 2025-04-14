// SPDX-License-Identifier: MIT
 pragma solidity ^0.8.0;
 contract EHR {
    struct Record {
        string ipfsHash; // The unique hash of the file on IPFS
        address owner;   // The address of the patient (owner of the record)
    }
    mapping(address => Record[]) private records; // Mapping to store records for 
each address
    event RecordAdded(address indexed patient, string ipfsHash); // Event to signal 
when a record is added
    // Function to add a medical record
    function addRecord(string memory _ipfsHash) public {
        records[msg.sender].push(Record(_ipfsHash, msg.sender)); // Save the record 
for the patient
        emit RecordAdded(msg.sender, _ipfsHash); // Emit an event when a record is 
added
    }
    // Function to get all records of a patient
    function getRecords() public view returns (Record[] memory) {
        return records[msg.sender]; // Return all records of the calling patient
    }
 }


 // Enhanced

 // SPDX-License-Identifier: MIT
 pragma solidity ^0.8.0;
 contract EHR {

    struct Record {
        string ipfsHash;
        address owner;
    }
    mapping(address => Record[]) private records;
    mapping(address => bool) public doctors; // Mapping to store doctor addresses
    event RecordAdded(address indexed patient, string ipfsHash);
    
    modifier onlyDoctor() {
        require(doctors[msg.sender] == true, "Only authorized doctors can access 
this");
        _;
    }
    // Add a new doctor
    function addDoctor(address _doctor) public {
        doctors[_doctor] = true;
    }
    // Allow patients to add medical records
    function addRecord(string memory _ipfsHash) public {
        records[msg.sender].push(Record(_ipfsHash, msg.sender));
        emit RecordAdded(msg.sender, _ipfsHash);
    }
    // Fetch records for a specific patient
    function getRecords() public view returns (Record[] memory) {
        return records[msg.sender];
    }
    // Allow doctors to view patient records
    function getPatientRecords(address _patient) public view onlyDoctor returns 
(Record[] memory) {
        return records[_patient];
    }
 }