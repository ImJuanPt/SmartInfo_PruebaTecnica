import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginForm from './view/LoginForm';
import RegisterForm from './view/RegisterForm';
import MainBlock from './view/MainBlock';
import PrivateRoute from './view/configAuth/PrivatRoute'; 
import MenuEditForm from './view/MenuEditForm';
import MenuInputsForm from './view/MenuInputsForm';
import MenuForm from './view/MenuForm';
import DepartamentoForm from './view/DepartamentoForm';
import DepartamentoFormInputs from './view/DepartamentoFormInputs';
import PersonaForm from './view/PersonaForm';
import PersonaFormInputs from './view/PersonaFormInputs';
import NotFoundPage from './view/notFoundPage';

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<MainBlock />} />
                <Route path="/not-found" element={<NotFoundPage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/departamentos" element={<PrivateRoute />}>
                    <Route path="" element={<DepartamentoForm />} />
                </Route>
                <Route path="/menu" element={<PrivateRoute />}>
                    <Route path="" element={<MenuForm />} />
                </Route>
                <Route path="/edit-menu" element={<PrivateRoute />}>
                    <Route path="" element={<MenuEditForm />} />
                </Route>
                <Route path="/edit-menu-form" element={<PrivateRoute />}>
                    <Route path="" element={<MenuInputsForm />} />
                </Route>
                <Route path="/personas" element={<PrivateRoute />}>
                    <Route path="" element={<PersonaForm />} />
                </Route>
                <Route path="/edit-persona" element={<PrivateRoute />}>
                    <Route path="" element={<PersonaFormInputs />} />
                </Route>
                <Route path="/edit-departamentos" element={<PrivateRoute />}>
                    <Route path="" element={<DepartamentoFormInputs />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;