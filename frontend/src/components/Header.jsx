import { useState } from 'react';
import { useAccount } from 'wagmi';
import { NavLink, useLocation } from 'react-router-dom';

const Header = () => {
  const { isConnected, address } = useAccount();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    console.log('Toggling mobile menu, connected:', isConnected, 'address:', address);
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Check if on a vault detail page (e.g., /vaults/0)
  const isVaultDetail = location.pathname.startsWith('/vaults/');
  const vaultId = isVaultDetail ? location.pathname.split('/').pop() : null;

  console.log('Header render, wallet connected:', isConnected, 'address:', address, 'path:', location.pathname, 'vaultId:', vaultId);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-2xl font-extrabold text-white">Y</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              YieldBlox
            </h1>
          </div>

          {/* Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-10">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-base font-medium text-gray-600 hover:text-purple-600 transition duration-300 ${
                  isActive ? 'text-purple-600 font-semibold' : ''
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `text-base font-medium text-gray-600 hover:text-purple-600 transition duration-300 ${
                  isActive ? 'text-purple-600 font-semibold' : ''
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                `text-base font-medium text-gray-600 hover:text-purple-600 transition duration-300 ${
                  isActive ? 'text-purple-600 font-semibold' : ''
                }`
              }
            >
              Analytics
            </NavLink>
            <NavLink
              to="/governance"
              className={({ isActive }) =>
                `text-base font-medium text-gray-600 hover:text-purple-600 transition duration-300 ${
                  isActive ? 'text-purple-600 font-semibold' : ''
                }`
              }
            >
              Governance
            </NavLink>
          </nav>

          {/* Wallet Button (Desktop) */}
          <div className="hidden lg:flex items-center space-x-4">
            {isVaultDetail && (
              <span className="text-sm font-medium text-gray-600">
                Vault #{vaultId}
              </span>
            )}
            <w3m-button />
          </div>

          {/* Hamburger Menu Button (Mobile) */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden flex items-center text-gray-600 hover:text-purple-600 transition duration-300"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isMobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden absolute top-full left-0 w-full bg-white shadow-md transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? 'max-h-96 py-6' : 'max-h-0'
          }`}
        >
          <div className="flex flex-col items-start px-6 space-y-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-base font-medium text-gray-600 hover:text-purple-600 transition duration-300 ${
                  isActive ? 'text-purple-600 font-semibold' : ''
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `text-base font-medium text-gray-600 hover:text-purple-600 transition duration-300 ${
                  isActive ? 'text-purple-600 font-semibold' : ''
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </NavLink>
            {isVaultDetail && (
              <NavLink
                to="/dashboard"
                className="text-base font-medium text-gray-600 hover:text-purple-600 transition duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Back to Dashboard
              </NavLink>
            )}
            <NavLink
              to="/analytics"
              className={({ isActive }) =>
                `text-base font-medium text-gray-600 hover:text-purple-600 transition duration-300 ${
                  isActive ? 'text-purple-600 font-semibold' : ''
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Analytics
            </NavLink>
            <NavLink
              to="/governance"
              className={({ isActive }) =>
                `text-base font-medium text-gray-600 hover:text-purple-600 transition duration-300 ${
                  isActive ? 'text-purple-600 font-semibold' : ''
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Governance
            </NavLink>
            {isVaultDetail && (
              <span className="text-sm font-medium text-gray-600">
                Vault #{vaultId}
              </span>
            )}
            <w3m-button />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;