import { FC } from 'react';
import './App.css';
import AboutPage from '../AboutPage/AboutPage';
import Navbar from '../Navbar/Navbar';
import HomePage from '../HomePage/HomePage';
import MediaFilesPage from '../MediaFilesPage/MediaFilesPage';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

const App: FC = () => {
  return (
    <div className="App">
     <Navbar />
     <Router>
        <Routes>
          <Route path='/about' element={<AboutPage />}></Route>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/medium-dot-com-files" element={<MediaFilesPage />}></Route>
        </Routes>
     </Router>
    </div>
  );
}

export default App;