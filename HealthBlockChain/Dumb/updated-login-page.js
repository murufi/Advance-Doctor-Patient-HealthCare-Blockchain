let web3;
let userAccount;
const contractAddress = "0xf8e81D47203A594245E36C48e151709F0C19fBe8";

const abi = [
    // ... (include the full ABI here)
];

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();
            userAccount = accounts[0];
            document.getElementById('walletStatus').innerHTML = `Connected: ${userAccount}`;
            document.getElementById('connectWallet').style.display = 'none';
            document.getElementById('loginOptions').style.display = 'block';
        } catch (error) {
            console.error("User denied account access");
        }
    } else {
        console.log('Non-Ethereum browser detected. Consider installing MetaMask!');
    }
}

async function login(role) {
    const contract = new web3.eth.Contract(abi, contractAddress);
    try {
        const hasRole = await contract.methods.checkRole(userAccount, role).call();
        if (hasRole) {
            if (role === 'patient') {
                window.location.href = 'patient.html';
            } else if (role === 'doctor') {
                window.location.href = 'doctor.html';
            }
        } else {
            document.getElementById('loginStatus').innerHTML = `<div class="alert alert-danger">You are not authorized as a ${role}.</div>`;
        }
    } catch (error) {
        console.error("An error occurred during login:", error);
        document.getElementById('loginStatus').innerHTML = `<div class="alert alert-danger">An error occurred. Please try again.</div>`;
    }
}

document.getElementById('connectWallet').addEventListener('click', connectWallet);
document.getElementById('patientLogin').addEventListener('click', () => login('patient'));
document.getElementById('doctorLogin').addEventListener('click', () => login('doctor'));

// Check if wallet is already connected
if (typeof window.ethereum !== 'undefined') {
    window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
        if (accounts.length > 0) {
            connectWallet();
        }
    });
}