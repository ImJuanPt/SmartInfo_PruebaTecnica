import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import backButtonIcon from '../util/icons/icon_back.png';

const MenuInputsForm = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id'); // Obtener el id del item del menu

    const [nombre, setNombre] = useState(''); // Estado para el nombre
    const [url, setUrl] = useState(''); // Estado para la url
    const [orden, setOrden] = useState(''); // Estado para el orden
    const [menuItems, setMenuItems] = useState([]); // Estado para los items del menu
    const [selectedParentId, setSelectedParentId] = useState(''); // Estado para el id del menu padre
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                if (id) {
                    const response = await fetch(`http://localhost:3001/api/menu/itemvalid/${id}`);
                    const data = await response.json();
                    setMenuItems(data);
                } else {
                    const response = await fetch(`http://localhost:3001/api/menu/`);
                    const data = await response.json();
                    setMenuItems(data);
                }
            } catch (error) {
                console.error('Error al obtener el menu:', error);
            }
        };

        const fetchMenuItem = async () => {
            if (id) {
                try {
                    const response = await fetch(`http://localhost:3001/api/menu/${id}`);
                    const data = await response.json();
                    setNombre(data.nombre || '');
                    setUrl(data.url || '');
                    setOrden(data.orden || '');
                    setSelectedParentId(data.parent_id || '');
                } catch (error) {
                    console.error('Error al obtener el elemento del menu:', error);
                }
            }
        };

        fetchMenuItems();
        fetchMenuItem();
    }, [id]);

    useEffect(() => {
        if (nombre) {
            const formattedNombre = nombre.replace(/\s+/g, '-').toLowerCase();
            setUrl(`/${formattedNombre}`); // Formatear la URL a partir del nombre
        } else {
            setUrl('');
        }
    }, [nombre]);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const confirm = window.confirm("¿Confirmar insercion?");
            if (!confirm) {
                return; // Si el usuario cancela, no hacer nada
            }

            const response = await fetch(id ? 'http://localhost:3001/api/menu/edit' : 'http://localhost:3001/api/menu/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, nombre, url, orden, selectedParentId }),
            });

            if (!response.ok) {
                let errorText = 'Error al guardar los cambios';
                try {
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.indexOf('application/json') !== -1) {
                        const errorData = await response.json();
                        errorText = errorData.error || errorText;
                    } else {
                        throw new Error('Respuesta no valida del servidor');
                    }
                } catch (error) {
                    console.error('Error al procesar la respuesta de error', error);
                }
                throw new Error(errorText);
            }

            const data = await response.json();
            alert(data.message);
            navigate('/menu'); // Redirigir a la lista de menu
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
                <h1 className="main-block-title">Completar los campos</h1>
            </div>
            <hr />
            <form className='main-block-form' onSubmit={handleRegister}>
                <input
                    className="main-block-input"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre"
                    required
                />
                <input
                    className="main-block-input"
                    type="text"
                    value={url}
                    placeholder="URL"
                    disabled
                />
                <div className='main-block-ElementTogether'>
                    <p>Menu padre: </p>
                    {menuItems && menuItems.length > 0 ? (
                        <select
                            className='main-block-select'
                            value={selectedParentId || ''}
                            onChange={(e) => setSelectedParentId(e.target.value)}
                        >
                            <option value="">Ninguno</option>
                            {menuItems.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.nombre}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <p>Este elemento ya pertenece a un submenu.</p>
                    )}
                </div>
                <input
                    className="main-block-input"
                    type="number"
                    min="0"
                    value={orden}
                    onChange={(e) => setOrden(e.target.value)}
                    placeholder="Orden"
                    required
                />
                <button className='btn secondary' type="submit">Guardar</button>
            </form>
        </div>
    );
};

export default MenuInputsForm;