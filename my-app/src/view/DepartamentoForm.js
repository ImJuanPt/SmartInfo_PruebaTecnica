import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backButtonIcon from '../util/icons/icon_back.png';

const MainBlock = () => {
    const navigate = useNavigate();
    const [departamentos, setDepartamentos] = useState([]); // Estado para almacenar departamentos
    const [selectedDepartamento, setSelectedDepartamento] = useState(null); // Estado para el departamento seleccionado
    const [personas, setPersonas] = useState([]); // Estado para almacenar personas
    const [viewingPersonas, setViewingPersonas] = useState(false); // Estado para determinar si se ven personas

    // Funcion para obtener departamentos
    const fetchDepartamentos = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/departamentos');
            if (!response.ok) {
                throw new Error('Error al obtener los departamentos');
            }
            const data = await response.json();
            setDepartamentos(data); // Establecer los departamentos obtenidos
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Funcion para obtener personas de un departamento
    const fetchPersonas = async (departamentoId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/personas/departamento/${departamentoId}`);
            if (!response.ok) {
                throw new Error('Error al obtener las personas');
            }
            const data = await response.json();
            setPersonas(data); // Establecer las personas obtenidas
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Efecto para cargar departamentos al montar el componente
    useEffect(() => {
        fetchDepartamentos();
    }, []);

    // Manejar edicion de un departamento
    const handleEdit = () => {
        if (selectedDepartamento) {
            navigate(`/edit-departamentos?id=${selectedDepartamento.id}`); // Redirigir a la página de edicion
        }
    };

    // Manejar eliminacion de un departamento
    const handleDelete = async () => {
        if (!selectedDepartamento) {
            return;
        }
        const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar el departamento "${selectedDepartamento.nombre}"?`);

        if (!confirmDelete) {
            return;
        }
        try {
            const response = await fetch('http://localhost:3001/api/departamentos/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: selectedDepartamento.id }),
            });

            if (response.ok) {
                console.log("Elemento eliminado:", selectedDepartamento.id);
                setDepartamentos(departamentos.filter(dep => dep.id !== selectedDepartamento.id)); // Actualizar el estado de departamentos
                setSelectedDepartamento(null); // Limpiar la seleccion
                setViewingPersonas(false); // Resetear la vista
            } else {
                const errorData = await response.json();
                console.error('Error al eliminar el departamento:', errorData.error);
            }
        } catch (error) {
            console.error('Error al realizar la solicitud de eliminacion:', error);
        }
    };

    // Manejar la vista de personas o departamentos
    const handleView = () => {
        if (viewingPersonas) {
            // Volver a la vista de departamentos
            setViewingPersonas(false);
            setSelectedDepartamento(null); // Resetear la seleccion
            setPersonas([]); // Limpiar la lista de personas
        } else if (selectedDepartamento) {
            // Obtener personas del departamento seleccionado
            fetchPersonas(selectedDepartamento.id);
            setViewingPersonas(true);
        }
    };

    // Manejar el cambio en la seleccion de departamento
    const handleCheckboxChange = (departamento) => {
        setSelectedDepartamento(selectedDepartamento?.id === departamento.id ? null : departamento);
    };

    // Manejar el clic en el boton de volver
    const handleBackButtonClick = () => {
        navigate("/menu"); // Volver a la pagina anterior
    };

    return (
        <div className="main-block">
            <div className='main-block-ElementTogether'>
                <button className='main-block-button btnVolver' onClick={handleBackButtonClick}>
                    <img src={backButtonIcon} alt="Volver" />
                </button>
                <h1 className="main-block-title">Departamentos</h1>
            </div>
            <hr />
            <div className="table-container"> 
                <table className="departamentos-table">
                    <thead>
                        <tr>
                            {viewingPersonas ? (
                                <>
                                    <th>Seleccionar</th>
                                    <th>Cedula</th>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Departamento ID</th>
                                </>
                            ) : (
                                <>
                                    <th>Seleccionar</th>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Descripcion</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {viewingPersonas ? (
                            personas.map(persona => (
                                <tr key={persona.cedula}>
                                    <td></td>
                                    <td>{persona.cedula}</td>
                                    <td>{persona.nombre}</td>
                                    <td>{persona.email}</td>
                                    <td>{persona.departamento_id}</td>
                                </tr>
                            ))
                        ) : (
                            departamentos.map(departamento => (
                                <tr key={departamento.id} onClick={() => handleCheckboxChange(departamento)}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedDepartamento?.id === departamento.id}
                                            onChange={() => handleCheckboxChange(departamento)}
                                        />
                                    </td>
                                    <td>{departamento.id}</td>
                                    <td>{departamento.nombre}</td>
                                    <td>{departamento.descripcion}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="button-group">
                <button className='btn warning' onClick={handleEdit} disabled={!selectedDepartamento || viewingPersonas}>Editar</button>
                <button className='btn danger' onClick={handleDelete} disabled={!selectedDepartamento || viewingPersonas}>Eliminar</button>
                <button className='btn secondary' onClick={handleView} disabled={!selectedDepartamento}>
                    {viewingPersonas ? 'Volver' : 'Ver'}
                </button>
                <Link to="/edit-departamentos">
                    <button className='btn success'>Crear</button>
                </Link>
            </div>
        </div>
    );
};

export default MainBlock;