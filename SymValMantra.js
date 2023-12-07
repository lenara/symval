import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import SymbolicValueTokenABI from './abis/SyMantra.json';

// Add your background image URL
const backgroundImageUrl = 'url("symval_background.png")';


const TokenContractAddress = '0xCf603f43689a641CFADeDb81D853c43d599c9f00';

const Symantra = () => {
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState('');
    const [mantrasList, setMantrasList] = useState([]);
    const [mantra, setMantra] = useState('');
    //const [tokenMantras, setTokenMantras] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [balance, setBalance] = useState(0);
    const [totalSupply, setTotalSupply] = useState(0);
    const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccount(accounts[0]);

          const web3 = new Web3(window.ethereum);
          const contractInstance = new web3.eth.Contract(SymbolicValueTokenABI.abi, TokenContractAddress);
          setContract(contractInstance);

          const tokenBalance = await contractInstance.methods.balanceOf(accounts[0], 1).call();
          //console.log('Token balance:', tokenBalance)
          setBalance(Number(tokenBalance));

          const supply = await contractInstance.methods.totalSupply().call();
          setTotalSupply(Number(supply));

          /*/ Fetch the symbolic value for the first token (you can adjust this based on your requirements)
          //const tokenIdToFetch = 1;
          //const symbolicMantra = await contractInstance.methods.getTokenMantra(1).call();
          
          //setTokenmantra(symbolicMantra);
          // Fetch the symbolic value for the first token (you can adjust this based on your requirements)
          const tokenIdToFetch = 1;
          const symbolicMantra = await contractInstance.methods.getTokenMantra(tokenIdToFetch).call();
          setTokenMantras({ ...tokenMantras, [tokenIdToFetch]: symbolicMantra });

          // Fetch and set mantras for all minted tokens
          const tokens = Array.from({ length: totalSupply }, (_, index) => index + 1);
          const fetchedMantras = await Promise.all(
            tokens.map(async (token) => {
              const mantra = await contractInstance.methods.getTokenMantra(token).call();
              return { tokenId: token, mantra };
            })
          );

          const tokenMantrasMap = fetchedMantras.reduce((acc, { tokenId, mantra }) => {
            acc[tokenId] = mantra;
            return acc;
          }, {});

          setTokenMantras(tokenMantrasMap);*/

          // Fetch the list of mantras and quantities
          const mantras = await fetchMantrasList(contractInstance);
          setMantrasList(mantras);

        } catch (error) {
          console.error('User denied account access:', error);
        }
      } else if (window.web3) {
        const newWeb3 = new Web3(window.web3.currentProvider);
        setContract(newWeb3.eth.Contract(SymbolicValueTokenABI.abi, TokenContractAddress));
        // Fetch the list of mantras and quantities
        const mantras = await fetchMantrasList(newWeb3.eth.Contract(SymbolicValueTokenABI.abi, TokenContractAddress));
        setMantrasList(mantras);

      } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    };

    init();
  }, []);

  const fetchMantrasList = async (contractInstance) => {
    // Fetch the list of mantras and quantities from the contract
    const supply = await contractInstance.methods.totalSupply().call();

    const mantrasMap = new Map();
    for (let i = 1; i <= supply; i++) {
      const mantra = await contractInstance.methods.getTokenMantra(i).call();
      if (mantrasMap.has(mantra)) {
        mantrasMap.set(mantra, mantrasMap.get(mantra) + 1);
      } else {
        mantrasMap.set(mantra, 1);
      }
    }

    // Convert the map to an array of objects
    const mantras = Array.from(mantrasMap).map(([mantra, quantity]) => ({ mantra, quantity }));
    return mantras;
  };


  const mintToken = async () => {
    try {
      // Ensure quantity is a positive integer
      const parsedQuantity = parseInt(quantity, 10);
      if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        throw new Error('Quantity must be a positive integer');
      }
  
      const tx = await contract.methods.mintTokens(account, mantra, parsedQuantity).send({ from: account, gasLimit: 5000000 });
      console.log('Mint Transaction:', tx);
  
      // Adjusted to retrieve balance for the last minted token
      const tokenBalance = await contract.methods.balanceOf(account, totalSupply).call();
      setBalance(tokenBalance);
      // Fetch the updated list of mantras and quantities
      const mantras = await fetchMantrasList(contract);
      setMantrasList(mantras);
      
      setError(''); // Reset error state on successful minting
    } catch (error) {
      console.error('Error minting token', error);
      setError(error.message || 'Error minting token');
    }
  };
  
  
  

  return (
    <div>
     
     {/* Navigation Bar */}
     <nav style={{ backgroundColor: '#367c87', padding: '10px', color: 'white', textAlign: 'center', position: 'fixed', width: '100%', zIndex: '100' }}>
  <h2 style={{ margin: '0' }}>Symbolic Value Token</h2>
  {/* Add navigation links if needed */}
  <ul style={{ listStyle: 'none', padding: '0', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0' }}>
    <li style={{ margin: '0 15px' }}>
      <a href="#" style={{ textDecoration: 'none', color: 'white', fontSize: '14px' }}>Total Supply: {totalSupply}</a>
    </li>
    <li style={{ margin: '0 15px' }}>
      <a href="#" style={{ textDecoration: 'none', color: 'white', fontSize: '14px' }}>Token Balance: {balance}</a>
    </li>
    <li style={{ margin: '0 15px' }}>
      <a href="#" style={{ textDecoration: 'none', color: 'white', fontSize: '14px' }}>Connected Account: {account}</a>
    </li>
  </ul>
</nav>


      {/* Header with Background Image */}
      <header style={{ backgroundImage: backgroundImageUrl, backgroundSize: 'cover', padding: '220px', textAlign: 'center', color: 'white' }}>
        
        {/* You can add more content here */}
      </header>


      {/* Mint Token Form */}
<div style={{ margin: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
  <h2 style={{ marginBottom: '10px' }}>Mint Token</h2>
  <label style={{ display: 'block', marginBottom: '5px' }}>Mantra:</label>
  <input
    type="text"
    value={mantra}
    onChange={(e) => setMantra(e.target.value)}
    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
  />
  <br />
  <label style={{ display: 'block', marginBottom: '5px' }}>Quantity:</label>
  <input
    type="number"
    value={quantity}
    onChange={(e) => setQuantity(e.target.value)}
    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
  />
  <br />
  <button onClick={mintToken} style={{ padding: '10px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
    Mint Tokens
  </button>
  {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
</div>

{/* Mantras List */}
<div style={{ margin: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
  <h2 style={{ marginBottom: '10px' }}>Mantras List</h2>
  <ul style={{ listStyle: 'none', padding: '0' }}>
    {mantrasList.map((mantraInfo, index) => (
      <li key={index} style={{ marginBottom: '10px', fontSize: '14px' }}>
        <strong>Mantra:</strong> {mantraInfo.mantra}, <strong>Quantity:</strong> {mantraInfo.quantity}
      </li>
    ))}
  </ul>
</div>


      {/* Footer */}
      <footer style={{ backgroundColor: '#367c87', padding: '10px', color: 'white', textAlign: 'center' }}>
        <p>&copy; 2023 SymVal. All rights reserved.</p>
      </footer>

    </div>
  );
};

export default Symantra;
