import { Link } from 'react-router-dom';
import { useReadContract } from 'wagmi';

const yieldBloxAbi = [
  {
    "inputs": [],
    "name": "getVaults",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "contract IERC20", "name": "token", "type": "address" },
          { "internalType": "uint256", "name": "totalDeposits", "type": "uint256" },
          { "internalType": "uint256", "name": "apy", "type": "uint256" },
          { "internalType": "bool", "name": "active", "type": "bool" }
        ],
        "internalType": "struct YieldBlox.Vault[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const Vaults = () => {
  const { data: vaults, isLoading, error } = useReadContract({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: yieldBloxAbi,
    functionName: 'getVaults',
  });

  if (isLoading) return <div>Loading vaults...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {vaults?.map((vault, index) => (
        <div key={index} className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{vault.name}</h3>
          <p className="text-gray-600 mb-2">APY: {(vault.apy / 100).toFixed(2)}%</p>
          <p className="text-gray-600 mb-4">TVL: {(vault.totalDeposits / 1e18).toFixed(2)} SONE</p>
          <Link
            to={`/vaults/${index}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-xl"
          >
            View Vault
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Vaults;