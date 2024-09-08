import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './configAuth/AuthProv';
import editButtonIcon from '../util/icons/edit_button.png';
import backButtonIcon from '../util/icons/icon_back.png';

const MenuForm = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [menuStructure, setMenuStructure] = useState([]);
    const [openMenus, setOpenMenus] = useState({});
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            fetchMenuItems();
        }
    }, [user, navigate]);

    const fetchMenuItems = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/menu');
            if (!response.ok) {
                throw new Error('Error al obtener el menu');
            }
            const data = await response.json();
            setMenuItems(data);
            organizeMenu(data); // Organiza el menu
        } catch (error) {
            console.error('Error al obtener el menu:', error);
        }
    };

    const organizeMenu = (items) => {
        const menuTree = items
            .filter(item => !item.parent_id)  // Filtra los elementos que no tienen padre
            .map(parent => ({
                ...parent,
                children: items.filter(child => child.parent_id === parent.id),  // Encuentra los hijos del padre
                url: parent.url // Asegurate de que el item tenga una propiedad url
            }));

        // Añadir el elemento estatico departamentos y su hijo "Personas"
        const staticMenuItems = [
            {
                id: 'departamentos', // id unico para el elemento estatico
                nombre: 'Departamentos',
                url: '/departamentos', // Ruta del elemento estatico
                children: []
            },
            {
                id: 'personas', // id unico para el hijo
                nombre: 'Personas',
                url: '/personas', // Ruta del hijo
                parent_id: 'departamentos'
            }
        ];

        // Agregar elementos estaticos al arbol del menu
        menuTree.unshift(staticMenuItems[0]); // Agrega Departamentos al inicio
        menuTree[0].children.push(staticMenuItems[1]); // Añadir Personas como hijo de Departamentos

        setMenuStructure(menuTree);
    };

    const toggleMenu = (id) => {
        setOpenMenus(prevState => ({
            ...prevState,
            [id]: !prevState[id]  // Alterna el estado abierto/cerrado del menu desplegable
        }));
    };

    const handleBackButtonClick = () => {
        navigate("/");
    };

    return (
        <div className="main-block">
            {user ? (
                <>
                    <div className='main-block-ElementTogether'>
                        <button className='main-block-button btnVolver' onClick={handleBackButtonClick}>
                            <img src={backButtonIcon} alt="Volver" />
                        </button>
                        <h1 className="main-block-title">Menu dinamico</h1>
                    </div>

                    <hr />
                    {menuStructure.length > 0 ? (
                        <ul>
                            {menuStructure.map(item => (
                                <li key={item.id} className="main-block-menu-element">
                                    {/* Elemento padre como un enlace */}
                                    <Link to="/not-found" className="menu-link">
                                        <span>
                                            {item.nombre}
                                        </span>
                                    </Link>

                                    {/* Boton desplegable */}
                                    {item.children.length > 0 && (
                                        <button
                                            className='main-block-button_desplegable'
                                            onClick={(event) => {
                                                event.stopPropagation(); // Evita que el clic en el boton active el enlace
                                                toggleMenu(item.id);
                                            }}
                                        >
                                            {openMenus[item.id] ? '▲' : '▼'}  {/* Boton desplegable */}
                                        </button>
                                    )}

                                    {/* Submenu si el elemento tiene hijos */}
                                    {openMenus[item.id] && item.children.length > 0 && (
                                        <ul>
                                            {item.children.map(child => (
                                                <li key={child.id} className="main-block-submenu-element">
                                                    <Link to={child.url} className="menu-link">
                                                        {child.nombre}
                                                    </Link> {/* Enlace para el hijo */}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay elementos en el menu.</p>
                    )}
                    <div className='main-block-menu-Editbutton'>
                        <Link to="/edit-menu">
                            <button className='main-block-button'>
                                <img src={editButtonIcon} alt="Edit Button" />
                            </button>
                        </Link>
                    </div>
                </>
            ) : (
                <p>Redirigiendo a login...</p>
            )}
        </div>
    );
};

export default MenuForm;
