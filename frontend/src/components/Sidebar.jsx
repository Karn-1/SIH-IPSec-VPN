import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  Upload, 
  FileText, 
  History, 
  Shield,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/new-analysis', icon: Upload, label: 'New Analysis' },
      ]
    },
    {
      title: 'ANALYSIS',
      items: [
        { path: '/history', icon: History, label: 'History' },
        { path: '/reports', icon: FileText, label: 'Reports' },
      ]
    },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
        className="fixed left-4 top-4 z-50 rounded-xl border border-soc-border bg-soc-card p-2 shadow-lg transition-all duration-200 hover:border-soc-primary/50 hover:bg-soc-cardHover focus-visible:ring-2 focus-visible:ring-soc-primary lg:hidden"
      >
        {isOpen ? <X className="h-6 w-6 text-soc-primary" /> : <Menu className="h-6 w-6 text-soc-text" />}
      </button>

      <aside
        aria-label="Primary navigation"
        className={`fixed left-0 top-0 z-40 min-h-screen w-72 bg-soc-primaryDark shadow-2xl shadow-soc-primaryDark/30 transition-transform duration-300 ease-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="rounded-xl bg-white/15 p-2"><Shield className="h-5 w-5 text-white" /></div>
            <span className="text-lg font-bold tracking-wide text-white">IPSEC AI</span>
          </div>
          
          {navSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              <p className="text-xs font-semibold text-white/55 mb-3 px-4">{section.title}</p>
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`group relative flex items-center space-x-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                        isActive
                          ? 'bg-white/15 text-white shadow-inner shadow-white/10'
                          : 'text-white/70 hover:translate-x-1 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {isActive && <span className="absolute bottom-2 left-0 top-2 w-1 rounded-full bg-soc-accent" />}
                      <Icon className={`h-5 w-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                      <span className="text-sm font-medium">{item.label}</span>
                      {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-soc-accent shadow-[0_0_10px_rgba(85,199,217,0.8)]" />}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}

        </div>
      </aside>

      {isOpen && (
        <div
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 animate-in bg-black/60 backdrop-blur-[2px] duration-300"
        />
      )}
    </>
  );
};

export default Sidebar;
