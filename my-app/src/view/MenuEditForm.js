import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backButtonIcon from '../util/icons/icon_back.png';

const EditMenuItemsPage = () => {
    const [selectedItems, setSelectedItems] = useState([]); // Estado para los items seleccionados
    const [menuItems, setMenuItems] = useState([]); // Estado para los items del menu
    const navigate = useNavigate();

    // Funcion para obtener los elementos del menu
    const fetchMenuItems = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/menu');
            const data = await response.json();
            setMenuItems(data); // Actualiza el estado con los datos recibidos
        } catch (error) {
            console.error('Error al obtener el menú:', error);
        }
    };

    // Llama a la funcion al montar el componente
    useEffect(() => {
        fetchMenuItems();
    }, []);

    const handleSelectItem = (itemId) => {
        if (selectedItems.includes(itemId)) {
            setSelectedItems(selectedItems.filter((id) => id !== itemId)); // Desmarcar item
        } else {
            setSelectedItems([...selectedItems, itemId]); // Marcar item
        }
    };

    const handleEdit = () => {
        if (selectedItems.length === 1) {
            const selectedItemId = selectedItems[0];
            navigate(`/edit-menu-form?id=${selectedItemId}`); // Redirigir a la pagina de edicion
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar los elementos seleccionados?");

        if (!confirmDelete) {
            return; // Si el usuario cancela, no hacer nada
        }
        try {
            const response = await fetch('http://localhost:3001/api/menu/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids: selectedItems }), // Envia los ids seleccionados
            });

            if (response.ok) {
                console.log("Elementos eliminados:", selectedItems);
                fetchMenuItems(); // Actualiza la lista de items
                setSelectedItems([]); // Limpiar seleccion
            } else {
                const errorData = await response.json();
                console.error('Error al eliminar elementos:', errorData.error);
            }
        } catch (error) {
            console.error('Error al realizar la solicitud de eliminacion:', error);
        }
    };

    const handleAdd = () => {
        navigate('/edit-menu-form'); // Redirigir a la pagina de agregar
    };

    const handleBackButtonClick = () => {
        navigate("/menu"); // Volver a la pagina anterior
    };

    return (
        <div className="main-block">
            <div className='main-block-ElementTogether'>
                <button className='main-block-button btnVolver' onClick={handleBackButtonClick}>
                    <img src={backButtonIcon} alt="Volver" />
                </button>
                <h1 className="main-block-title">Editar Menú</h1>
            </div>
            <div className="menu-items-container">
                {menuItems && menuItems.length > 0 ? (
                    menuItems.map((item) => (
                        <div key={item.id} className='main-block-menu-element'>
                            <input
                                type="checkbox"
                                checked={selectedItems.includes(item.id)}
                                onChange={() => handleSelectItem(item.id)} // Manejar seleccion de item
                            />
                            <span>{item.nombre}</span>
                        </div>
                    ))
                ) : (
                    <p>No hay elementos en el menú para mostrar.</p>
                )}
            </div>
            <div>
                <button className='btn warning' onClick={handleEdit} disabled={selectedItems.length !== 1}>Editar</button>
                <button className='btn danger' onClick={handleDelete} disabled={selectedItems.length === 0}>Eliminar</button>
                <button className='btn success' onClick={handleAdd}>Agregar</button>
            </div>
        </div>
    );
}

export default EditMenuItemsPage;