//Loging Code
async function login(role) {
    const contract = new web3.eth.Contract(abi, contractAddress);
    try {

        // const hasRole = await contract.methods.checkRole(userAccount, role).call();
        // We'll use a transaction attempt to determine if the user has the correct role

        if (role === 'patient') {
            // Try to add a complaint (we'll catch the error if it fails)
            await contract.methods.addComplaint("Test complaint").send({
                from: userAccount,
                gas: 3000000
            });
            window.location.href = 'patient.html';
        }
        if (role === 'doctor') {
            // Try to reply to a complaint (we'll catch the error if it fails)
            // Note: This might fail if there are no complaints, so we should handle that case
            const complaintCount = await contract.methods.complaintCount();
            if (complaintCount > 0) {
                await contract.methods.replyToComplaint(0, "Test reply").send({
                    from: userAccount,
                    gas: 3000000
                });
            } else {

                window.location.href = 'doctor.html';
            }
            window.location.href = 'doctor.html';
        }

    } catch (error) {
        console.error("An error occurred during login:", error);
        document.getElementById('loginStatus').innerHTML = `<div class="alert alert-danger">You are not authorized as a ${role}.</div>`;
    }
}

//Loging Code end

//Doctor Code 
async function checkLoginState() {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        try {
            const accounts = await web3.eth.getAccounts();
            if (accounts.length > 0) {
                userAccount = accounts[0];
                contract = new web3.eth.Contract(abi, contractAddress);
                const isDoctor = await contract.methods.checkRole(userAccount, 'doctor');
                if (isDoctor) {
                    document.getElementById('loginStatus').innerHTML = `<div class="alert alert-success">Welcome, Doctor ${userAccount}</div>`;
                    document.getElementById('doctorContent').style.display = 'block';
                    loadComplaints();
                } else {
                    document.getElementById('loginStatus').innerHTML = '<div class="alert alert-danger">You are not authorized as a doctor. Please login with a doctor account.</div>';
                }
            } else {
                document.getElementById('loginStatus').innerHTML = '<div class="alert alert-warning">Please connect your wallet and login.</div>';
            }
        } catch (error) {
            console.error("An error occurred:", error);
            document.getElementById('loginStatus').innerHTML = '<div class="alert alert-danger">An error occurred. Please try again.</div>';
        }
    } else {
        document.getElementById('loginStatus').innerHTML = '<div class="alert alert-warning">Please install MetaMask or another Ethereum wallet.</div>';
    }
}