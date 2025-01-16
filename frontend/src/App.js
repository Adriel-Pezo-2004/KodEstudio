import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import RequirementsForm from './components/Common/RequirementsForm/RequirementsForm';
import RequirementList from './components/Common/RequirementList/RequirementList';
import Login from './components/Login/Login';
import Logout from './components/Logout/Logout';
import './App.css';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const token = localStorage.getItem('token');
  return token ? <Component {...rest} /> : <Navigate to="/login" />;
};

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
            <Route path="/requirements-list" element={
              <div className="container py-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  
                </div>
                  <PrivateRoute element={
                  RequirementList} />
              </div>
            } />
            <Route path="/edit-requirement/:id" element={
              <div className="container py-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  
                </div>
                <RequirementsForm />
              </div>
            } />
            <Route path="/login" element={
              <div className="container py-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  
                </div>
                <Login />
              </div>
            } />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;