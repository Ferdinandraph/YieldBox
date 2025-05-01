import { useReadContract } from 'wagmi';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import YieldBloxABI from '../abis/YieldBox.json';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Analytics = () => {
  const { data: vaults, isLoading, error } = useReadContract({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: YieldBloxABI,
    functionName: 'getVaults',
    chainId: 1946,
  });

  const tvl = vaults ? vaults.reduce((sum, vault) => sum + Number(vault.totalDeposits) / 1e18, 0) : 0;

  const chartData = {
    labels: vaults?.map((vault) => vault.name) || [],
    datasets: [
      {
        label: 'TVL (TST)',
        data: vaults?.map((vault) => Number(vault.totalDeposits) / 1e18) || [],
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.5)',
      },
      {
        label: 'APY (%)',
        data: vaults?.map((vault) => Number(vault.apy) / 100) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };

  console.log('Analytics:', { vaults, tvl, isLoading, error });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Vault Analytics</h2>
      {isLoading && <p className="text-gray-600">Loading analytics...</p>}
      {error && <p className="text-red-600">Error: {error.message}</p>}
      {!isLoading && !error && (!vaults || vaults.length === 0) && (
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <p className="text-gray-600 mb-4">No vaults available.</p>
          <p className="text-gray-500">Contact admin for vault details.</p>
        </div>
      )}
      {!isLoading && !error && vaults?.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-gray-600 mb-4">Total Value Locked: {tvl.toFixed(2)} TST</p>
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: { legend: { position: 'top' }, title: { display: true, text: 'Vault Performance' } },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Analytics;