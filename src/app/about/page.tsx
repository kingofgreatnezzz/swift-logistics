export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
            About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SwiftLogistics</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
            Transforming global supply chains with cutting-edge technology and premium service.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300">
              To revolutionize global logistics through AI-powered solutions, real-time tracking, 
              and seamless integration across supply chains. We're committed to delivering 
              exceptional value to businesses and individuals worldwide.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h2>
            <p className="text-gray-600 dark:text-gray-300">
              To become the world's most trusted logistics platform, connecting businesses 
              across continents with intelligent, efficient, and sustainable delivery solutions 
              powered by artificial intelligence and blockchain technology.
            </p>
          </div>
        </div>

        {/* Company Story */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Our Story</h2>
          <div className="prose prose-lg dark:prose-invert mx-auto">
            <p>
              Founded in 2023, SwiftLogistics emerged from a simple observation: global logistics 
              was ripe for disruption. Traditional shipping methods were slow, opaque, and inefficient.
            </p>
            <p>
              Our team of logistics experts, software engineers, and AI researchers came together 
              to build a platform that would transform how goods move around the world. Today, 
              we serve thousands of businesses across 50+ countries with our premium logistics 
              solutions.
            </p>
            <p>
              From small e-commerce stores to Fortune 500 companies, our platform provides 
              the tools needed to streamline supply chains, reduce costs, and deliver 
              exceptional customer experiences.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Innovation',
                description: 'Constantly pushing boundaries with AI, automation, and cutting-edge technology.',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                title: 'Transparency',
                description: 'Real-time tracking and clear communication at every step of the journey.',
                color: 'from-purple-500 to-pink-500'
              },
              {
                title: 'Reliability',
                description: 'Consistent, secure, and timely delivery you can count on.',
                color: 'from-green-500 to-emerald-500'
              }
            ].map((value, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className={`h-2 w-16 rounded-full bg-gradient-to-r ${value.color} mb-4`} />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Alex Chen', role: 'CEO & Founder', bio: 'Former logistics executive with 15+ years experience.' },
              { name: 'Maria Rodriguez', role: 'CTO', bio: 'AI and blockchain expert from Silicon Valley.' },
              { name: 'James Wilson', role: 'COO', bio: 'Supply chain optimization specialist.' },
              { name: 'Sarah Johnson', role: 'CFO', bio: 'Financial strategist and venture capital veteran.' }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-blue-600 dark:text-blue-400 mb-2">{member.role}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}