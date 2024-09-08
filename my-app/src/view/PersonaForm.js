import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backButtonIcon from '../util/icons/icon_back.png';

const MainBlock = () => {
    const navigate = useNavigate();
    const [personas, setPersonas] = useState([]); // Estado para las personas
    const [selectedPersona, setSelectedPersona] = useState(null); // Estado para la persona seleccionada

    const fetchPersonas = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/personas');
            if (!response.ok) {
                throw new Error('Error al obtener las personas');
            }
            const data = await response.json();
            setPersonas(data); // Actualiza el estado con los datos recibidos
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchPersonas(); // Llama a la funcion al montar el componente
    }, []);

    const handleEdit = () => {
        if (selectedPersona) {
            navigate(`/edit-persona?id=${selectedPersona.cedula}`); // Redirigir al componente de edicion
        }
    };

    const handleDelete = async () => {
        if (!selectedPersona) {
            return;
        }
        const confirmDelete = window.confirm(`¿Estas seguro de que deseas eliminar a "${selectedPersona.nombre}"?`);

        if (!confirmDelete) {
            return; // Si el usuario cancela, no hacer nada
        }
        try {
            const response = await fetch('http://localhost:3001/api/personas/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cedula: selectedPersona.cedula }), // Envia la cedula a eliminar
            });

            if (response.ok) {
                console.log("Elemento eliminado:", selectedPersona.cedula);
                setPersonas(personas.filter(persona => persona.cedula !== selectedPersona.cedula)); // Actualiza la lista de personas
                setSelectedPersona(null); // Limpiar seleccion
            } else {
                const errorData = await response.json();
                console.error('Error al eliminar la persona:', errorData.error);
            }
        } catch (error) {
            console.error('Error al realizar la solicitud de eliminacion:', error);
        }
    };

    const handleCheckboxChange = (persona) => {
        // Seleccionar o deseleccionar la persona
        setSelectedPersona(selectedPersona?.cedula === persona.cedula ? null : persona);
    };

    const handleBackButtonClick = () => {
        navigate("/menu") // Volver a la pagina anterior
    };

    return (
        <div className="main-block">
            <div className='main-block-ElementTogether'>
                <button className='main-block-button btnVolver' onClick={handleBackButtonClick}>
                    <img src={backButtonIcon} alt="Volver" />
                </button>
                <h1 className="main-block-title">Gestion personas</h1>
            </div>
            <hr />
            <table className="personas-table">
                <thead>
                    <tr>
                        <th>Seleccionar</th>
                        <th>Cedula</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Departamento ID</th>
                    </tr>
                </thead>
                <tbody>
                    {personas.map(persona => (
                        <tr key={persona.cedula} onClick={() => handleCheckboxChange(persona)}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedPersona?.cedula === persona.cedula}
                                    onChange={() => handleCheckboxChange(persona)} // Manejar cambio de checkbox
                                />
                            </td>
                            <td>{persona.cedula}</td>
                            <td>{persona.nombre}</td>
                            <td>{persona.email}</td>
                            <td>{persona.departamento_id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="button-group">
                <button className='btn warning' onClick={handleEdit} disabled={!selectedPersona}>Editar</button>
                <button className='btn danger' onClick={handleDelete} disabled={!selectedPersona}>Eliminar</button>
                <Link to="/edit-persona">
                    <button className='btn success'>Registrar</button>
                </Link>
            </div>
        </div>
    );
};

export default MainBlock;