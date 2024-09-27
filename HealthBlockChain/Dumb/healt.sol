// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthComplaints {
    struct Complaint {
        uint id;
        address patient;
        string complaintText;
        string reply;
        bool replied;
    }

    Complaint[] public complaints;
    uint public complaintCount;

    event NewComplaint(uint id, address patient);
    event Replied(uint id, string reply);

    function addComplaint(string memory _complaintText) public {
        complaints.push(Complaint(complaintCount, msg.sender, _complaintText, "", false));
        emit NewComplaint(complaintCount, msg.sender);
        complaintCount++;
    }

    function replyToComplaint(uint _id, string memory _reply) public {
        Complaint storage complaint = complaints[_id];
        require(!complaint.replied, "Complaint already replied");
        require(msg.sender != complaint.patient, "Patient cannot reply to their own complaint");
        
        complaint.reply = _reply;
        complaint.replied = true;
        emit Replied(_id, _reply);
    }

    function getComplaint(uint _id) public view returns (string memory, string memory) {
        Complaint memory complaint = complaints[_id];
        return (complaint.complaintText, complaint.reply);
    }
}
