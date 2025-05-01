import { Link } from 'react-router-dom';
import {
  EnvelopeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ScaleIcon,
} from '@heroicons/react/24/outline';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Branding and Description */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                <span className="text-xl font-bold text-white">Y</span>
              </div>
              <h4 className="ml-3 text-lg font-semibold text-white">YieldBox</h4>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering wealth creation with secure, high-yield vaults on the Soneium Minato Testnet.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h5 className="text-lg font-semibold text-white mb-4">Quick Links</h5>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/dashboard"
                  className="text-sm text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                  aria-label="Go to Dashboard"
                >
                  <ChartBarIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/governance"
                  className="text-sm text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                  aria-label="Go to Governance"
                >
                  <ScaleIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                  Governance
                </Link>
              </li>
              <li>
                <a
                  href="https://docs.yieldbox.finance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                  aria-label="View Documentation"
                >
                  <DocumentTextIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Contact and Social */}
          <div>
            <h5 className="text-lg font-semibold text-white mb-4">Get in Touch</h5>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:support@yieldbox.finance"
                  className="text-sm text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                  aria-label="Email Support"
                >
                  <EnvelopeIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                  support@yieldbox.finance
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/yieldbox"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                  aria-label="Follow on Twitter"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/yieldbox"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-300 hover:text-white transition-colors duration-200 flex items-center"
                  aria-label="Join Discord Community"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.078.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.078-.037A19.736 19.736 0 0 0 3.677 4.37a.068.068 0 0 0-.029.019C.533 9.045-.319 13.579.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 0-.08-.014c-.126.056-.246.11-.375.162a.075.075 0 0 0-.035.029c-.097.09-.195.182-.292.274a.076.076 0 0 0-.013.106c.252.252.568.475.936.681a.076.076 0 0 0 .088-.019c.344-.33.712-.678 1.098-1.037a.076.076 0 0 0 .026-.087 18.792 18.792 0 0 0 2.966 0 .076.076 0 0 0 .026.087c.387.36.754.707 1.098 1.037a.077.077 0 0 0 .088.019c.368-.206.684-.429.936-.681a.076.076 0 0 0-.013-.106c-.097-.092-.195-.184-.292-.274a.075.075 0 0 0-.035-.029c-.129-.052-.249-.106-.375-.162a.077.077 0 0 0-.08.014 13.107 13.107 0 0 1-1.872.892.076.076 0 0 0-.041.106c.36.43.756.868 1.226 1.994a.078.078 0 0 0 .084.028 19.897 19.897 0 0 0 5.993-3.03.082.082 0 0 0 .031-.057c.448-4.533-.404-9.079-3.148-13.688a.068.068 0 0 0-.029-.019zM8.41 16.845c-.584 0-1.066-.482-1.066-1.066 0-.585.482-1.067 1.066-1.067.585 0 1.067.482 1.067 1.067 0 .584-.482 1.066-1.067 1.066zm7.179 0c-.584 0-1.066-.482-1.066-1.066 0-.585.482-1.067 1.066-1.067.585 0 1.067.482 1.067 1.067 0 .584-.482 1.066-1.067 1.066z" />
                  </svg>
                  Discord
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} YieldBox. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;