import React from 'react'

const NIDASPORTZ = () => {
  return (
    <div>
      <div className="max-w-6xl mx-auto w-full lg:w-1/2">
              <div className="grid lg:grid-cols-1 gap-6 sm:gap-8 lg:gap-12 items-center">

                {/* Left Side - Main Image */}
                <div className="order-2 lg:order-1 flex justify-center lg:justify-center">
                  {/* UPDATED: Reduced max-w from max-w-sm sm:max-w-md to max-w-xs sm:max-w-sm */}
                  <Link href="/sports" className="block group relative max-w-xs sm:max-w-sm w-full">
                    {/* Decorative sport icons - floating around the main image */}
                    <div className="absolute -left-6 sm:-left-8 top-1/4 w-12 sm:w-16 h-12 sm:h-16 opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-float hidden md:block">
                      <Image
                        src="/sports/badminton.png"
                        alt="Badminton"
                        width={64}
                        height={64}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="absolute -right-6 sm:-right-8 top-1/3 w-16 sm:w-20 h-16 sm:h-20 opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-float hidden md:block" style={{ animationDelay: '0.3s' }}>
                      <Image
                        src="/sports/cricket.png"
                        alt="Cricket"
                        width={100}
                        height={100}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="absolute -left-8 sm:-left-12 bottom-1/4 w-14 sm:w-18 h-14 sm:h-18 opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-float hidden md:block" style={{ animationDelay: '0.6s' }}>
                      <Image
                        src="/sports/pickleball.png"
                        alt="Pickleball"
                        width={72}
                        height={72}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Main Title Image */}
                    <div className="rounded-lg overflow-hidden shadow-xl sm:shadow-2xl shadow-purple-500/20 transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-purple-500/40 relative">
                      <Image
                        src="/sports/title.jpeg"
                        alt="NIDASPORTZ 2025"
                        width={800}
                        height={1131}
                        layout="responsive"
                        className="relative z-10"
                      />
                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>
                    </div>
                  </Link>
                </div>

                {/* Right Side - Text and CTA */}
                <div className="order-1 lg:order-2 text-center lg:text-center space-y-4 sm:space-y-6">
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent animate-fade-in-up">
                      Unleash Your Athletic Spirit
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white leading-relaxed max-w-xl mx-auto lg:mx-auto">
                      Join NIDASPORTZ 2025 - Season 6 for an exciting season of competition, camaraderie, and celebration across multiple sports.
                    </p>

                    {/* Date Buttons */}
                    <div className='flex flex-col flex-row xs:flex-row gap-3 sm:gap-4 justify-center lg:justify-center items-center pt-2'>
                      <button className="relative flex flex-col items-center justify-center h-24 sm:h-28 w-32 sm:w-40 overflow-hidden border border-indigo-600 text-white rounded-lg shadow-lg transition-all duration-300 ease-out group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <span className="absolute top-0 left-0 w-full h-full bg-indigo-600 transition-all duration-300 ease-out transform scale-0 group-hover:scale-100 group-focus:scale-100 opacity-90"></span>
                        <span className="relative z-10 flex flex-col items-center transition-colors duration-300 group-hover:text-white group-focus:text-white">
                          <span className="text-xs font-semibold tracking-wider uppercase opacity-80">Saturday</span>
                          <span className="text-4xl sm:text-5xl font-bold leading-tight">15</span>
                          <span className="text-xs sm:text-sm">November 2025</span>
                        </span>
                      </button>

                      <button className="relative flex flex-col items-center justify-center h-24 sm:h-28 w-32 sm:w-40 overflow-hidden border border-indigo-600 text-white rounded-lg shadow-lg transition-all duration-300 ease-out group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        <span className="absolute top-0 left-0 w-full h-full bg-indigo-600 transition-all duration-300 ease-out transform scale-0 group-hover:scale-100 group-focus:scale-100 opacity-90"></span>
                        <span className="relative z-10 flex flex-col items-center transition-colors duration-300 group-hover:text-white group-focus:text-white">
                          <span className="text-xs font-semibold tracking-wider uppercase opacity-80">Sunday</span>
                          <span className="text-4xl sm:text-5xl font-bold leading-tight">16</span>
                          <span className="text-xs sm:text-sm">November 2025</span>
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-center items-center pt-2">
                    <Link href="/sports">
                      <button className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded-full transition-all duration-300 ease-in-out text-sm sm:text-base shadow-lg transform hover:scale-105 hover:-translate-y-1">
                        <span className="relative z-10">Explore Sports</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition duration-500"></div>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
    </div>
  )
}

export default NIDASPORTZ
