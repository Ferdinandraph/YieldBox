import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import YieldBloxABI from '../abis/YieldBox.json';
import TestTokenABI from '../abis/TestToken.json';

const VaultDetail = () => {
  const { id } = useParams(); // Vault ID (e.g., "0")
  const { address } = useAccount(); // Connected wallet
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  // Fetch vault data
  const { data: vaults, error: vaultsError, isLoading: vaultsLoading } = useReadContract({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: YieldBloxABI,
    functionName: 'getVaults',
    chainId: 1946,
  });

  // Fetch user balance
  const { data: userBalance, error: balanceError, isLoading: balanceLoading } = useReadContract({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: YieldBloxABI,
    functionName: 'getUserBalance',
    args: [BigInt(id), address],
    chainId: 1946,
  });

  // Approve TestToken
  const { writeContract: approveToken, isPending: approvePending } = useWriteContract();

  // Deposit and withdraw
  const { writeContract, isPending: actionPending } = useWriteContract();

  const handleApprove = async () => {
    try {
      await approveToken({
        address: vaults?.[id]?.token, // TestToken address
        abi: TestTokenABI,
        functionName: 'approve',
        args: [import.meta.env.VITE_CONTRACT_ADDRESS, parseEther(depositAmount)],
      });
      console.log('Approval successful');
    } catch (err) {
      console.error('Approval failed:', err);
    }
  };

  const handleDeposit = async () => {
    try {
      await writeContract({
        address: import.meta.env.VITE_CONTRACT_ADDRESS,
        abi: YieldBloxABI,
        functionName: 'deposit',
        args: [BigInt(id), parseEther(depositAmount)],
      });
      setDepositAmount('');
      console.log('Deposit successful');
    } catch (err) {
      console.error('Deposit failed:', err);
    }
  };

  const handleWithdraw = async () => {
    try {
      await writeContract({
        address: import.meta.env.VITE_CONTRACT_ADDRESS,
        abi: YieldBloxABI,
        functionName: 'withdraw',
        args: [BigInt(id), parseEther(withdrawAmount)],
      });
      setWithdrawAmount('');
      console.log('Withdrawal successful');
    } catch (err) {
      console.error('Withdrawal failed:', err);
    }
  };

  console.log('VaultDetail:', { vaults, userBalance, vaultsError, balanceError, vaultsLoading, balanceLoading, vaultId: id });

  if (vaultsLoading || balanceLoading) return <p className="text-gray-600">Loading vault...</p>;
  if (vaultsError || balanceError) return <p className="text-red-600">Error: {vaultsError?.message || balanceError?.message}</p>;
  if (!vaults || !vaults[id]) return <p className="text-gray-600">Vault not found</p>;

  const vault = vaults[id];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">{vault.name || `Vault #${id}`}</h2>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <p className="text-gray-600 mb-2">APY: {(Number(vault.apy) / 100).toFixed(2)}%</p>
        <p className="text-gray-600 mb-2">TVL: {(Number(vault.totalDeposits) / 1e18).toFixed(2)} TST</p>
        <p className="text-gray-600 mb-4">Your Balance: {(Number(userBalance) / 1e18).toFixed(2)} TST</p>
        <p className="text-gray-600 mb-4">Active: {vault.active ? 'Yes' : 'No'}</p>
        <p className="text-gray-600 mb-4">Token: {vault.token}</p>

        {/* Deposit Form */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Deposit</h3>
          <div className="grid grid-cols-1 gap-4">
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Amount in TST"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
            <button
              onClick={handleApprove}
              disabled={approvePending || !depositAmount}
              className={`inline-flex items-center px-6 py-3 text-sm font-bold text-white rounded-xl shadow-md transition duration-300 ${
                approvePending || !depositAmount
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {approvePending ? 'Approving...' : 'Approve TST'}
            </button>
            <button
              onClick={handleDeposit}
              disabled={actionPending || !depositAmount}
              className={`inline-flex items-center px-6 py-3 text-sm font-bold text-white rounded-xl shadow-md transition duration-300 ${
                actionPending || !depositAmount
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {actionPending ? 'Depositing...' : 'Deposit'}
            </button>
          </div>
        </div>

        {/* Withdraw Form */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Withdraw</h3>
          <div className="grid grid-cols-1 gap-4">
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Amount in TST"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
            <button
              onClick={handleWithdraw}
              disabled={actionPending || !withdrawAmount}
              className={`inline-flex items-center px-6 py-3 text-sm font-bold text-white rounded-xl shadow-md transition duration-300 ${
                actionPending || !withdrawAmount
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {actionPending ? 'Withdrawing...' : 'Withdraw'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultDetail;