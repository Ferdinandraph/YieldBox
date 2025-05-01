import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import vaultImage from '../assets/vaultimg.png';

function Hero() {
  const { isConnected, address } = useAccount();

  console.log('Hero render, wallet connected:', isConnected, 'address:', address);

  const handleImageError = (e) => {
    console.error('Failed to load image:', e.target.src);
    e.target.src = '/assets/vaultimg.png'; // Fallback to public/assets/
  };

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Text and Buttons */}
        <div className="text-center lg:text-left animate-fade-in">
          <div className="flex items-center justify-center lg:justify-start mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-xl font-bold text-white">Y</span>
            </div>
            <h4 className="ml-3 text-sm font-semibold tracking-widest text-indigo-600 uppercase">
              YieldBox DeFi Platform
            </h4>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight">
            Maximize Your Yield with YieldBox
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
            Discover secure, high-yield vaults on the Soneium Minato Testnet. Connect your wallet and start earning effortlessly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <w3m-button />
            <Link
              to="/dashboard"
              className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-md transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              aria-label="Explore the YieldBox Dashboard"
            >
              Explore Dashboard
            </Link>
            <a
              href="https://docs.yieldbox.finance"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-xl shadow-sm transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              aria-label="Contact YieldBox Support"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 mr-2"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                  clipRule="evenodd"
                />
              </svg>
              Contact Us
            </a>
          </div>
        </div>

        {/* Right Column: Image */}
        <div className="flex justify-center lg:justify-end">
          <img
            src={vaultImage}
            alt="YieldBox Dashboard Preview"
            onError={handleImageError}
            className="w-full max-w-md rounded-xl object-cover transform transition-transform duration-300"
          />
        </div>
      </div>
    </div>
  );
}

export default Hero;