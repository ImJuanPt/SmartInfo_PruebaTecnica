import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import backButtonIcon from '../util/icons/icon_back.png';

const EditPersona = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const cedula = queryParams.get('id'); // Obtener cedula desde los parametros de la URL

    const [nombre, setNombre] = useState(''); // Estado para el nombre
    const [email, setEmail] = useState(''); // Estado para el email
    const [departamentoId, setDepartamentoId] = useState(''); // Estado para el id del departamento
    const [departamentos, setDepartamentos] = useState([]); // Estado para los departamentos
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPersona = async () => {
            if (cedula) {
                try {
                    const response = await fetch(`http://localhost:3001/api/personas/${cedula}`);
                    const data = await response.json();
                    setNombre(data.nombre || '');
                    setEmail(data.email || '');
                    setDepartamentoId(data.departamento_id || '');
                } catch (error) {
                    console.error('Error al obtener la persona:', error);
                }
            }
        };

        const fetchDepartamentos = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/departamentos');
                const data = await response.json();
                setDepartamentos(data); // Actualiza el estado con los departamentos
            } catch (error) {
                console.error('Error al obtener los departamentos:', error);
            }
        };

        fetchPersona(); // Cargar persona si hay cedula
        fetchDepartamentos(); // Cargar departamentos
    }, [cedula]);

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!nombre || !email || !departamentoId) {
            alert('Todos los campos son obligatorios.'); // Validar campos requeridos
            return; 
        }

        try {
            const response = await fetch(cedula ? 'http://localhost:3001/api/personas/edit' : 'http://localhost:3001/api/personas/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cedula, nombre, email, departamento_id: departamentoId || null }),
            });

            if (!response.ok) {
                throw new Error('Error al guardar los cambios');
            }

            const data = await response.json();
            alert(data.message); // Mostrar mensaje de exito
            navigate('/personas'); // Redirigir a la lista de personas
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    const handleBackButtonClick = () => {
        navigate(-1); // Volver a la pagina anterior
    };

    return (
        <div className="main-block">
            <div className='main-block-ElementTogether'>
                <button className='main-block-button btnVolver' onClick={handleBackButtonClick}>
                    <img src={backButtonIcon} alt="Volver" />
                </button>
                <h1 className="main-block-title">{cedula ? 'Editar Persona' : 'Registrar Persona'}</h1>
            </div>
            <form className='main-block-form' onSubmit={handleRegister}>
                <label className='labelForm'>Cedula:</label>
                <input
                    className="main-block-input"
                    type="text"
                    value={cedula}
                    readOnly // Campo solo lectura
                />
                <label className='labelForm'>Nombre:</label>
                <input
                    type="text"
                    className="main-block-input"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)} // Manejar cambio en el nombre
                    placeholder="Nombre"
                    required
                />
                <label className='labelForm'>Email:</label>
                <input
                    type="email"
                    className="main-block-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // Manejar cambio en el email
                    placeholder="Email"
                    required
                />
                <label className='labelForm'>Departamento:</label>
                <select
                    className="main-block-input"
                    value={departamentoId}
                    onChange={(e) => setDepartamentoId(e.target.value)} // Manejar cambio en departamento
                    required
                >
                    <option value="">Seleccione un departamento</option>
                    {departamentos.map(departamento => (
                        <option key={departamento.id} value={departamento.id}>
                            {departamento.nombre}
                        </option>
                    ))}
                </select>
                <button className='btn success' type="submit">{cedula ? 'Guardar Cambios' : 'Registrar'}</button>
            </form>
        </div>
    );
};

export default EditPersona;