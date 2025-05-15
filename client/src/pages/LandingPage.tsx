import React from "react";

function LandingPage() {
  return (
    <div className="font-sans min-h-screen flex flex-col bg-[#f0f4ff] text-[#1a1a2e]">
      <div className="w-full bg-[#4a6fa5] text-white text-center text-xs py-1">
        No credit card required • No signup needed • Start creating instantly
      </div>
      <header className="flex items-center justify-between px-8 py-4 w-full bg-transparent gap-2">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <svg
              className="h-8 w-8 text-[#4a6fa5]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
            </svg>
            <span className="text-xl font-bold text-[#1a1a2e]">SpeakHire</span>
            <span className="text-xl font-bold text-[#4a6fa5]">Survey</span>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <section className="w-full py-12 md:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 flex flex-col items-center relative">
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center px-4 sm:px-6">
          <div className="w-full max-w-4xl mx-auto">
            <div className="flex flex-col items-center space-y-6 sm:space-y-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                Create Beautiful Surveys{" "}
                <span className="block sm:inline-block mt-2 sm:mt-0">
                  <span className="text-[#4a6fa5]">Without the Hassle</span>
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto px-4 sm:px-0">
                No signup required. Just start creating, share, and get
                responses in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
                <a
                  href="/create"
                  className="w-full sm:w-auto bg-[#4a6fa5] text-white px-6 sm:px-8 py-3 rounded-lg shadow font-semibold hover:bg-[#3a5a80] transition-colors text-sm sm:text-base text-center"
                >
                  Create a Survey
                </a>
                <a
                  href="/login"
                  className="w-full sm:w-auto bg-white text-[#4a6fa5] border border-[#4a6fa5] px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base text-center"
                >
                  Return to Your Survey
                </a>
              </div>
              <p className="text-xs sm:text-sm text-gray-500">
                No credit card required • No commitment
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Key Features Section */}
      <section className="w-full px-5 py-20 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            Everything you need to create amazing surveys
          </h2>
          <div className="grid md:grid-cols-2 gap-12 w-full">
            <div className="flex gap-6">
              <div className="bg-blue-50 p-4 rounded-xl h-12 w-12 flex-shrink-0 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-[#4a6fa5]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Drag & Drop Builder
                </h3>
                <p className="text-gray-600">
                  Intuitive interface that lets you create professional surveys
                  in minutes with our easy drag and drop editor.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-6">
              <div className="bg-purple-50 p-4 rounded-xl h-12 w-12 flex-shrink-0 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  100+ Ready Templates
                </h3>
                <p className="text-gray-600">
                  Choose from our library of professional templates for surveys,
                  quizzes, and feedback forms.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-6">
              <div className="bg-green-50 p-4 rounded-xl h-12 w-12 flex-shrink-0 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  AI-Powered Creation
                </h3>
                <p className="text-gray-600">
                  Let our AI help you create the perfect survey based on your
                  goals and target audience.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex gap-6">
              <div className="bg-yellow-50 p-4 rounded-xl h-12 w-12 flex-shrink-0 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Invite-Only Access
                </h3>
                <p className="text-gray-600">
                  Control who can access your surveys with password protection
                  and invitation-only options.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto w-full">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 sm:mb-12 md:mb-16">
            Why Choose SpeakHire?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 max-w-6xl mx-auto">
            <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#4a6fa5] mb-3 sm:mb-4">
                96%
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                of customers report a significantly better brand experience with
                our platform
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#4a6fa5] mb-3 sm:mb-4">
                95%
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                of users gather more comprehensive data with greater ease
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4 sm:p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#4a6fa5] mb-3 sm:mb-4">
                87%
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                of teams uncover deeper insights from their collected data
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Call-to-action Section */}
      <section className="bg-gradient-to-r from-[#4a6fa5] to-[#3a5a80] text-white w-full py-16 px-5">
        <div className="flex flex-col items-center max-w-4xl mx-auto gap-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to create your first survey?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl">
            Join thousands of professionals who trust SpeakHire Survey for their
            data collection needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <a
              href="/create"
              className="bg-white text-[#4a6fa5] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm"
            >
              Create a Survey - It's Free
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors text-sm"
            >
              Watch Demo
            </a>
          </div>
          <p className="text-sm text-blue-100 mt-2">
            No credit card required • No commitment • Start in seconds
          </p>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-[#1a1a2e] text-white text-sm w-full py-12 px-5 mt-auto">
        <div className="max-w-5xl mx-auto grid md:grid-cols-5 grid-cols-2 gap-8">
          <div>
            <div className="font-bold mb-2">Product</div>
            <ul>
              <li>
                <a href="#">Pricing</a>
              </li>
              <li>
                <a href="#">Enterprise</a>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-bold mb-2">Templates</div>
            <ul>
              <li>
                <a href="#">Popular templates</a>
              </li>
              <li>
                <a href="#">Recent templates</a>
              </li>
              <li>
                <a href="#">Categories</a>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-bold mb-2">Integrations</div>
            <ul>
              <li>
                <a href="#">Slack</a>
              </li>
              <li>
                <a href="#">Mailchimp</a>
              </li>
              <li>
                <a href="#">CRM</a>
              </li>
              <li>
                <a href="#">Stripe</a>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-bold mb-2">Resources</div>
            <ul>
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <a href="#">Help Center</a>
              </li>
              <li>
                <a href="#">Community</a>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-bold mb-2">Get to Know Us</div>
            <ul>
              <li>
                <a href="#">About us</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-[#a6cab3] flex flex-col md:flex-row justify-between items-center gap-4 mt-10 pt-6 border-t border-[#a6cab3] text-xs opacity-80">
          <div className="flex flex-wrap gap-2 items-center justify-center">
            <span>© 2024 SpeakHire</span>
            <span>•</span>
            <a href="/privacy" className="hover:underline">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="/terms" className="hover:underline">
              Terms of Service
            </a>
            <span>•</span>
            <a href="/cookies" className="hover:underline">
              Cookie Settings
            </a>
          </div>
          <div>English</div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
