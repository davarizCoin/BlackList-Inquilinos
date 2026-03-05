import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Páginas (Mocks temporários)
import Home from './pages/Home';
import ReportForm from './pages/ReportForm';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        {/* Navbar Global */}
        <header className="bg-brand-dark text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between py-4 items-center">
              <Link to="/" className="flex items-center drop-shadow-xl hover:scale-[1.02] transition-transform">
                <img src="/LogoFull.jpg" alt="Blacklist Inquilinos" className="h-16 md:h-24 w-auto object-contain object-left mr-4" />
              </Link>
              <nav className="flex gap-4">
                <Link to="/reportar" className="text-sm font-semibold bg-brand-accent hover:bg-red-800 px-4 py-2 rounded-md transition-colors">
                  Fazer Denúncia
                </Link>
                <Link to="/admin" className="text-sm font-medium text-slate-300 hover:text-white px-2 py-2">
                  Acesso Restrito
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reportar" element={<ReportForm />} />
            <Route path="/perfil/:id" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
          <p>© 2026 Blacklist Inquilinos. Protegendo o patrimônio imobiliário de forma anônima e segura (Hospedado fora do BR).</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
