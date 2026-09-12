import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/DashboardProduct';
import NewAnalysis from './pages/NewAnalysis';
import AnalysisResult from './pages/AnalysisResultProduct';
import History from './pages/HistoryProduct';

const Report = lazy(() => import('./pages/ReportProduct'));

function App() {
  return (
    <Router>
      <div className="app-shell flex min-h-screen bg-soc-background lg:pl-72">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto">
            <Suspense fallback={<div className="p-6 text-soc-textSecondary">Loading report...</div>}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/new-analysis" element={<NewAnalysis />} />
                <Route path="/result" element={<AnalysisResult />} />
                <Route path="/result/:id" element={<AnalysisResult />} />
                <Route path="/history" element={<History />} />
                <Route path="/reports" element={<Report />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
