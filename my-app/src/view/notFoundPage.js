import React from 'react';
import { Link } from 'react-router-dom';

const MainBlock = () => {
    return (
        <div className="main-block">
            <h1 className="main-block-title">Pagina inexistente</h1>
            <hr />
            <Link to="/menu" className="main-block-element">Menú</Link>
        </div>
    );
};

export default MainBlock;