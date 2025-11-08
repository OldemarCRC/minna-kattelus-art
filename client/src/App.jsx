import { Outlet, ScrollRestoration } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import './styles/global.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <ScrollRestoration />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
