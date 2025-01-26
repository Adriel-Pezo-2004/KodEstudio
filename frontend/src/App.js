import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import RequirementsForm from './components/Common/RequirementsForm/RequirementsForm';
import RequirementList from './components/Common/RequirementList/RequirementList';
import Login from './components/Login/Login';
import Logout from './components/Logout/Logout';
import Registro from './components/Registro/Registro';
import ClientesList from './components/Common/ClientesList/ClientesList';
import ClientesForm from './components/Common/ClientesForm/ClientesForm';
import PageTitle from './components/PageTitle/PageTitle';
import About from './pages/About/About';
import Simulador from './components/Common/Simulador/Simulador';

function App() {
  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={
              <>
                <PageTitle title="Inicio - Kod Estudio" />
                <Home />
              </>
            } />
            <Route path="/sobre-nosotros" element={
              <div className="container py-5">
                <PageTitle title="Sobre Nosotros - Kod Estudio" />
                <div className="d-flex justify-content-between align-items-center mb-4"></div>
                <About />
              </div>
            } />
            <Route path="/simulador" element={
              <div className="container py-5">
                <PageTitle title="Simulador de Proyectos - Kod Estudio" />
                <div className="d-flex justify-content-between align-items-center mb-4"></div>
                <Simulador />
              </div>
            } />
            <Route path="/requirements" element={
              <div className="container py-5">
                <PageTitle title="Nueva Solicitud - Kod Estudio" />
                <div className="d-flex justify-content-between align-items-center mb-4"></div>
                <RequirementsForm />
              </div>
            } />
            <Route path="/requirements-list" element={
              <div className="container py-5">
                <PageTitle title="Lista de Solicitudes - Kod Estudio" />
                <div className="d-flex justify-content-between align-items-center mb-4"></div>
                <RequirementList />
              </div>
            } />
            <Route path="/edit-requirement/:id" element={
              <div className="container py-5">
                <PageTitle title="Editar Solicitud - Kod Estudio" />
                <div className="d-flex justify-content-between align-items-center mb-4"></div>
                <RequirementsForm />
              </div>
            } />
            <Route path="/clientes" element={
              <div className="container py-5">
                <PageTitle title="Nuevo Cliente - Kod Estudio" />
                <div className="d-flex justify-content-between align-items-center mb-4"></div>
                <ClientesForm />
              </div>
            } />
            <Route path="/clientes-list" element={
              <div className="container py-5">
                <PageTitle title="Lista de Clientes - Kod Estudio" />
                <div className="d-flex justify-content-between align-items-center mb-4"></div>
                <ClientesList />
              </div>
            } />
            <Route path="/edit-cliente/:id" element={
              <div className="container py-5">
                <PageTitle title="Editar Cliente - Kod Estudio" />
                <div className="d-flex justify-content-between align-items-center mb-4"></div>
                <ClientesForm />
              </div>
            } />
            <Route path="/login" element={
              <div className="container py-5">
                <PageTitle title="Iniciar Sesión - Kod Estudio" />
                <div className="d-flex justify-content-between align-items-center mb-4"></div>
                <Login />
              </div>
            } />
            <Route path="/logout" element={
              <>
                <PageTitle title="Cerrar Sesión - Kod Estudio" />
                <Logout />
              </>
            } />
            <Route path="/registro" element={
              <>
                <PageTitle title="Registro - Kod Estudio" />
                <Registro />
              </>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;