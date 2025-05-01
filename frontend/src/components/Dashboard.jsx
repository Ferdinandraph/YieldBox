import { useReadContract } from 'wagmi';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import YieldBloxABI from '../abis/YieldBox.json';

const Dashboard = () => {
  // Fetch vaults
  const { data: vaults, error, isLoading } = useReadContract({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: YieldBloxABI,
    functionName: 'getVaults',
    args: [],
    chainId: 1946,
  });

  console.log('Dashboard vaults:', vaults, 'error:', error, 'loading:', isLoading);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Explore YieldBlox Vaults</h2>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg mb-6 flex items-center">
          <ExclamationCircleIcon className="h-6 w-6 text-red-400 mr-2" aria-hidden="true" />
          <div>
            <p className="text-red-700 font-medium">Error loading vaults</p>
            <p className="text-red-600">{error.message}</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && (!vaults || vaults.length === 0) && (
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="mt-4 text-lg text-gray-600 font-medium">No vaults available</p>
          <p className="mt-2 text-gray-500">Contact the admin to create new vaults.</p>
          <a
            href="mailto:admin@yieldblox.com"
            className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out"
          >
            Contact Admin
          </a>
        </div>
      )}

      {/* Vaults List */}
      {!isLoading && !error && vaults?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vaults.map((vault, index) => (
            <Link
              key={index}
              to={`/vaults/${index}`}
              className="group block transform transition duration-300 hover:-translate-y-1"
              aria-label={`View details for ${vault.name || `Vault #${index}`}`}
            >
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 truncate">
                    {vault.name || `Vault #${index}`}
                  </h3>
                  <ChevronRightIcon
                    className="h-5 w-5 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-hidden="true"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600 flex items-center">
                    <span className="font-medium mr-1">APY:</span>
                    <span className="text-indigo-600 font-semibold">
                      {(Number(vault.apy) / 100).toFixed(2)}%
                    </span>
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <span className="font-medium mr-1">Status:</span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        vault.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {vault.active ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
