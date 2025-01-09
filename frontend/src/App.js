import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import RequirementsForm from './components/Common/RequirementsForm/RequirementsForm';
import RequirementList from './components/Common/RequirementList/RequirementList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/requirements" element={
              <div className="container py-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  
                </div>
                <RequirementsForm />
              </div>
            } />
            <Route path="/requirements-list" element={<RequirementList />} />
            <Route path="/edit-requirement/:id" element={<RequirementsForm />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;