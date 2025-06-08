import Link from 'next/link'

const Sidebar = () => {
  const pathname = '/'; // Replace with actual pathname
  const navItems = [
    { href: '/', label: 'Home', icon: <span>Home</span> },
    { href: '/about', label: 'About', icon: <span>About</span> },
    { href: '/services', label: 'Services', icon: <span>Services</span> },
    { href: '/contact', label: 'Contact', icon: <span>Contact</span> },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-48 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/images/sidebarbg.jpg)' }}>
      <div className="h-full w-full bg-black/50 backdrop-blur-md">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-white/10">
            <h1 className="text-xl font-bold text-white">AI 活動生成</h1>
          </div>
          <nav className="flex-1 px-2 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md mb-2 transition-colors ${
                  pathname === item.href
                    ? 'bg-white/30 text-white'
                    : 'text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Sidebar 