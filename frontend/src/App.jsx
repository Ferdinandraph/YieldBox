import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAccount, useDisconnect } from 'wagmi';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Governance from './components/Governance';
import VaultDetail from './components/VaultDetail';
import './index.css';

function App() {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const location = useLocation();

  useEffect(() => {
    if (window.ethereum) {
      const addSoneiumNetwork = async () => {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x7A2',
                chainName: 'Soneium Minato Testnet',
                nativeCurrency: {
                  name: 'Soneium',
                  symbol: 'SONE',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc.minato.soneium.org'],
                blockExplorerUrls: ['https://explorer-testnet.soneium.org'],
              },
            ],
          });
          console.log('Soneium network added to wallet');
        } catch (error) {
          console.error('Failed to add Soneium network:', error);
        }
      };

      window.ethereum
        .request({ method: 'eth_chainId' })
        .then((chainId) => {
          console.log('Current chainId:', parseInt(chainId, 16));
          if (parseInt(chainId, 16) !== 1946) {
            console.log('Wrong network, adding Soneium...');
            addSoneiumNetwork();
          }
        })
        .catch((error) => console.error('Failed to check chainId:', error));

      window.ethereum
        .request({ method: 'eth_accounts' })
        .then((accounts) => {
          console.log('Initial MetaMask accounts:', accounts);
          if (accounts.length === 0 && isConnected) {
            console.log('No accounts found, waiting for auto-connect...');
          }
        })
        .catch((error) => console.error('Failed to fetch eth_accounts:', error));

      const handleAccountsChanged = (accounts) => {
        console.log('Accounts changed:', accounts, 'timestamp:', new Date().toISOString());
        if (accounts.length === 0 && isConnected) {
          console.log('No accounts detected, starting reconnection check...');
          let attempts = 0;
          const maxAttempts = 5;
          const checkAccounts = () => {
            attempts++;
            window.ethereum
              .request({ method: 'eth_accounts' })
              .then((newAccounts) => {
                console.log(`Re-checked accounts (attempt ${attempts}):`, newAccounts, 'timestamp:', new Date().toISOString());
                if (newAccounts.length > 0) {
                  console.log('Accounts restored, no disconnect needed');
                } else if (attempts < maxAttempts) {
                  console.log(`No accounts, retrying (${attempts}/${maxAttempts})...`);
                  setTimeout(checkAccounts, 2000);
                } else {
                  console.log('Confirmed disconnection, disconnecting...');
                  disconnect();
                }
              })
              .catch((error) => console.error('Failed to re-check eth_accounts:', error));
          };
          setTimeout(checkAccounts, 2000);
        }
      };

      const handleChainChanged = (chainId) => {
        console.log('Chain changed:', parseInt(chainId, 16), 'timestamp:', new Date().toISOString());
        if (parseInt(chainId, 16) !== 1946) {
          console.log('Switching back to Soneium...');
          addSoneiumNetwork();
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    } else {
      console.warn('MetaMask not detected');
    }
  }, [isConnected, disconnect]);

  console.log('App render, wallet state:', {
    isConnected,
    isConnecting,
    isReconnecting,
    address,
    path: location.pathname,
    timestamp: new Date().toISOString(),
    wagmiConnected: localStorage.getItem('wagmi.connected'),
  });

  if (isConnecting || isReconnecting) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
        <p className="text-lg text-gray-600">Reconnecting wallet...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route
            path="/dashboard"
            element={isConnected ? <Dashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/vaults/:id"
            element={isConnected ? <VaultDetail /> : <Navigate to="/" />}
          />
          <Route
            path="/analytics"
            element={isConnected ? <Analytics /> : <Navigate to="/" />}
          />
          <Route
            path="/governance"
            element={isConnected ? <Governance /> : <Navigate to="/" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;