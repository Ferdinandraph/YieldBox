import { createAppKit } from '@reown/appkit';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { defineChain } from '@reown/appkit/networks';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Soneium Minato Testnet
const soneium = defineChain({
  id: 1946,
  caipNetworkId: 'eip155:1946',
  chainNamespace: 'eip155',
  name: 'Soneium Minato Testnet',
  nativeCurrency: { name: 'Soneium', symbol: 'SONE', decimals: 18 },
  rpcUrls: {
    default: { http: [`https://soneium-minato.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`] },
    public: { http: ['https://rpc.minato.soneium.org'] },
  },
  blockExplorers: {
    default: { name: 'Soneium Explorer', url: 'https://explorer-testnet.soneium.org' },
  },
});

// Wagmi configuration
const wagmiConfig = createConfig({
  chains: [soneium],
  transports: {
    [soneium.id]: http(`https://soneium-minato.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`, {
      fallback: [http('https://rpc.minato.soneium.org')],
    }),
  },
  autoConnect: true,
  storage: localStorage,
  pollingInterval: 4_000,
});

// Debug wagmiConfig
console.log('Wagmi Config:', {
  chains: wagmiConfig.chains.map((chain) => ({
    id: chain.id,
    name: chain.name,
  })),
  autoConnect: wagmiConfig.autoConnect,
});
console.log('Wagmi Config Full:', wagmiConfig);
console.log('Wagmi session state:', localStorage.getItem('wagmi.connected'));

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchInterval: 10_000,
    },
  },
});

// Create AppKit modal
const projectId = import.meta.env.VITE_REOWN_PROJECT_ID || 'ac9d4925edb5141cb4fe7f1aee135bd0';
console.log('Project ID:', projectId);

try {
  const adapter = new WagmiAdapter({
    networks: [soneium],
    projectId,
  });
  console.log('WagmiAdapter created:', adapter);

  const modal = createAppKit({
    adapters: [adapter],
    projectId,
    networks: [soneium],
    metadata: {
      name: 'YieldBlox',
      description: 'DeFi yield optimizer on Soneium',
      url: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
      icons: ['https://your-logo-url.com/icon.png'],
    },
    features: {
      analytics: false,
    },
    storage: localStorage,
    enableAutoConnect: true,
  });

  console.log('AppKit modal created:', modal);
  console.log('localStorage WalletConnect keys:', Object.keys(localStorage).filter((key) => key.includes('__WalletConnect__')));
  console.log('localStorage contents:', Object.entries(localStorage));
  console.log('sessionStorage contents:', Object.entries(sessionStorage));
  console.log('Networks:', [soneium]);
} catch (error) {
  console.error('Failed to create AppKit modal:', error);
  throw error;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);