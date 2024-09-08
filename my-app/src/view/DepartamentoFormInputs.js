import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import backButtonIcon from '../util/icons/icon_back.png';

const EditDepartments = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id'); // Obtener el ID del departamento

    const [nombre, setNombre] = useState(''); // Estado para el nombre
    const [descripcion, setDescripcion] = useState(''); // Estado para la descripcion
    const [fechaCreacion, setFechaCreacion] = useState(''); // Estado para la fecha de creacion
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDepartamento = async () => {
            if (id) {
                try {
                    const response = await fetch(`http://localhost:3001/api/departamentos/${id}`);
                    const data = await response.json();
                    if (data) {
                        setNombre(data.nombre || '');
                        setDescripcion(data.descripcion || '');
                        setFechaCreacion(data.fecha_creacion.split('T')[0] || getCurrentDate());
                    }
                } catch (error) {
                    console.error('Error al obtener el departamento:', error);
                }
            } else {
                setFechaCreacion(getCurrentDate()); // Establecer fecha actual si no hay ID
            }
        };

        const getCurrentDate = () => {
            const fecha = new Date();
            const anio = fecha.getFullYear();
            const mes = String(fecha.getMonth() + 1).padStart(2, '0');
            const dia = String(fecha.getDate()).padStart(2, '0');
            return `${anio}-${mes}-${dia}`;
        };

        fetchDepartamento();
    }, [id]);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(id ? 'http://localhost:3001/api/departamentos/edit' : 'http://localhost:3001/api/departamentos/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                    nombre,
                    descripcion,
                    fecha_creacion: fechaCreacion
                }),
            });

            if (!response.ok) {
                let errorText = 'Error al guardar los cambios';
                try {
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.indexOf('application/json') !== -1) {
                        const errorData = await response.json();
                        errorText = errorData.error || errorText;
                    }
                } catch (error) {
                    console.error('Error al procesar la respuesta de error', error);
                }
                throw new Error(errorText);
            }

            const data = await response.json();
            alert(data.message);
            navigate('/departamentos');
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
                <h1 className="main-block-title">{id ? 'Editar Departamento' : 'Crear Departamento'}</h1>
            </div>
            <hr />
            <form className='main-block-form' onSubmit={handleRegister}>
                <label className='labelForm'>Nombre:</label>
                <input
                    className="main-block-input"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre"
                    required
                />
                <label className='labelForm'>Descripción:</label>
                <input
                    className="main-block-input"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Descripción"
                    required
                />
                <label className='labelForm'>Fecha de creación:</label>
                <input
                    disabled
                    className="main-block-input"
                    type="date"
                    value={fechaCreacion}
                    onChange={(e) => setFechaCreacion(e.target.value)}
                    placeholder="Fecha de Creación"
                    required
                />
                <button className='btn success' type="submit">Guardar</button>
            </form>
        </div>
    );
};

export default EditDepartments;