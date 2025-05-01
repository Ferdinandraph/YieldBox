import { useState } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useQueryClient } from '@tanstack/react-query';
import { ExclamationCircleIcon, CheckCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import YieldBoxABI from '../abis/YieldBox.json';

const Governance = () => {
  const [proposalDescription, setProposalDescription] = useState('');
  const [vaultId, setVaultId] = useState('');
  const [newApy, setNewApy] = useState('');
  const [txStatus, setTxStatus] = useState('');
  const [txHash, setTxHash] = useState('');
  const queryClient = useQueryClient();

  // Fetch proposals
  const queryKey = ['getProposals', import.meta.env.VITE_CONTRACT_ADDRESS];
  const { data: proposals, error, isLoading, refetch } = useReadContract({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: YieldBoxABI,
    functionName: 'getProposals',
    args: [],
    chainId: 1946,
    query: {
      refetchInterval: 5000,
      cacheTime: 0,
    },
  });

  // Create proposal
  const { writeContractAsync: createProposal, isPending: isCreating } = useWriteContract();

  // Wait for transaction receipt
  const { data: receipt, isLoading: isReceiptLoading } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: 1946,
  });

  // Vote on proposal
  const { writeContractAsync: vote, isPending: isVoting } = useWriteContract();

  const handleCreateProposal = async () => {
    try {
      if (!proposalDescription) throw new Error('Description is required');
      if (vaultId === '' || isNaN(vaultId) || Number(vaultId) < 0) {
        throw new Error('Vault ID must be a non-negative number');
      }
      if (newApy === '' || isNaN(newApy) || Number(newApy) < 0) {
        throw new Error('New APY must be a non-negative number');
      }

      setTxStatus('Creating proposal...');
      setTxHash('');
      const hash = await createProposal({
        address: import.meta.env.VITE_CONTRACT_ADDRESS,
        abi: YieldBoxABI,
        functionName: 'createProposal',
        args: [proposalDescription, BigInt(vaultId), BigInt(newApy * 100)],
      });
      setTxHash(hash);
      setProposalDescription('');
      setVaultId('');
      setNewApy('');
      setTxStatus(`Proposal submitted: ${hash}`);
      await queryClient.invalidateQueries({ queryKey });
      console.log('Proposal submitted:', hash);
    } catch (err) {
      const errorMessage = err.cause?.reason || err.message || 'Unknown error';
      setTxStatus(`Failed to create proposal: ${errorMessage}`);
      console.error('Failed to create proposal:', err, 'Cause:', err.cause);
    }
  };

  const handleVote = async (proposalId, support) => {
    try {
      setTxStatus(`Voting ${support ? 'Yes' : 'No'}...`);
      const hash = await vote({
        address: import.meta.env.VITE_CONTRACT_ADDRESS,
        abi: YieldBoxABI,
        functionName: 'vote',
        args: [BigInt(proposalId), support],
      });
      await queryClient.invalidateQueries({ queryKey });
      setTxStatus(`Voted ${support ? 'Yes' : 'No'}: ${hash}`);
      console.log(`Voted ${support ? 'Yes' : 'No'} on proposal ${proposalId}:`, hash);
    } catch (err) {
      const errorMessage = err.cause?.reason || err.message || 'Unknown error';
      setTxStatus(`Failed to vote: ${errorMessage}`);
      console.error('Failed to vote:', err, 'Cause:', err.cause);
    }
  };

  console.log('Governance state:', {
    proposals,
    error,
    isLoading,
    receipt,
    txHash,
    txStatus,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Governance Hub</h2>

      {/* Transaction Status */}
      {txStatus && (
        <div
          className={`mb-6 flex items-center p-4 rounded-lg ${
            txStatus.includes('Failed')
              ? 'bg-red-50 border-l-4 border-red-400'
              : 'bg-green-50 border-l-4 border-green-400'
          }`}
        >
          {txStatus.includes('Failed') ? (
            <ExclamationCircleIcon className="h-6 w-6 text-red-400 mr-2" aria-hidden="true" />
          ) : (
            <CheckCircleIcon className="h-6 w-6 text-green-400 mr-2" aria-hidden="true" />
          )}
          <p
            className={`text-sm ${
              txStatus.includes('Failed') ? 'text-red-700' : 'text-green-700'
            }`}
          >
            {txStatus}
          </p>
        </div>
      )}
      {isReceiptLoading && (
        <div className="mb-6 flex items-center p-4 rounded-lg bg-gray-50 border-l-4 border-gray-400">
          <svg
            className="animate-spin h-6 w-6 text-gray-400 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-sm text-gray-700">Waiting for transaction confirmation...</p>
        </div>
      )}
      {receipt && (
        <div className="mb-6 flex items-center p-4 rounded-lg bg-green-50 border-l-4 border-green-400">
          <CheckCircleIcon className="h-6 w-6 text-green-400 mr-2" aria-hidden="true" />
          <p className="text-sm text-green-700">
            Transaction confirmed: {receipt.transactionHash} (Status: {receipt.status})
          </p>
        </div>
      )}

      {/* Create Proposal Form */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Create a New Proposal</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              id="description"
              type="text"
              value={proposalDescription}
              onChange={(e) => setProposalDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="E.g., Increase APY for Stablecoin Vault"
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="vaultId" className="block text-sm font-medium text-gray-700">
              Vault ID
            </label>
            <input
              id="vaultId"
              type="number"
              value={vaultId}
              onChange={(e) => setVaultId(e.target.value)}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="E.g., 0"
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="newApy" className="block text-sm font-medium text-gray-700">
              New APY (%)
            </label>
            <input
              id="newApy"
              type="number"
              value={newApy}
              onChange={(e) => setNewApy(e.target.value)}
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="E.g., 7.5"
              aria-required="true"
            />
          </div>
          <div className="sm:col-span-2 flex space-x-4">
            <button
              onClick={handleCreateProposal}
              disabled={isCreating || !proposalDescription || !vaultId || !newApy}
              className={`inline-flex items-center px-6 py-3 text-sm font-medium text-white rounded-md shadow-md transition duration-300 ${
                isCreating || !proposalDescription || !vaultId || !newApy
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isCreating ? 'Creating...' : 'Create Proposal'}
            </button>
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className={`inline-flex items-center px-6 py-3 text-sm font-medium text-white rounded-md shadow-md transition duration-300 ${
                isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Refreshing...' : 'Refresh Proposals'}
            </button>
          </div>
        </div>
      </div>

      {/* Proposals List */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-6">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg mb-6 flex items-center">
          <ExclamationCircleIcon className="h-6 w-6 text-red-400 mr-2" aria-hidden="true" />
          <div>
            <p className="text-red-700 font-medium">Error loading proposals</p>
            <p className="text-red-600">{error.message}</p>
          </div>
        </div>
      )}
      {!isLoading && !error && (!proposals || proposals.length === 0) && (
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
          <p className="mt-4 text-lg text-gray-600 font-medium">No proposals available</p>
          <p className="mt-2 text-gray-500">Create a proposal to vote on vault changes.</p>
        </div>
      )}
      {!isLoading && !error && proposals?.length > 0 && (
        <div className="grid grid-cols-1 gap-6">
          {proposals.map((proposal, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 truncate">
                  {proposal.description}
                </h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    proposal.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {proposal.isActive ? 'Active' : 'Closed'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <p className="text-gray-600">
                  <span className="font-medium">Vault ID:</span> {Number(proposal.vaultId)}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Proposed APY:</span>{' '}
                  {(Number(proposal.newApy) / 100).toFixed(2)}%
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Yes Votes:</span> {Number(proposal.yesVotes)}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">No Votes:</span> {Number(proposal.noVotes)}
                </p>
              </div>
              {proposal.isActive && (
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={() => handleVote(index, true)}
                    disabled={isVoting}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm transition duration-300 ${
                      isVoting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {isVoting ? 'Voting...' : 'Vote Yes'}
                  </button>
                  <button
                    onClick={() => handleVote(index, false)}
                    disabled={isVoting}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm transition duration-300 ${
                      isVoting ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {isVoting ? 'Voting...' : 'Vote No'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Governance;
