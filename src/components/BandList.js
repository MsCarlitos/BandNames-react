import React, { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../context/SocketContext';

export const BandList = () => {

    const [bands, setBands] = useState([]);
    const { socket } = useContext(SocketContext);

    const votar = (id) => {
        socket.emit('votar-banda', id);
    }

    const borrarBanda = (id) => {
        socket.emit('borrar-banda', id);
    }

    useEffect(() => {
        socket.on('current-bands', (bands) => {
            setBands(bands)
        })
        return () => socket.off('current-bands');
    }, [socket])

    const cambioNombre = (event, id) => {
        const newName = event.target.value;
        setBands(bands => bands.map(band => {
            if (band.id === id) {
                band.name = newName;
            }
            return band;
        }))
    }

    const onPerdioFoco = (id, nombre) => {
        socket.emit('cambiar-nombre-banda', { id, nombre });
    }

    const crearRows = () => {
        return (
            bands.map((band, index) => (
                <tr key={band.id}>
                    <td>
                        <button
                            className='btn btn-primary'
                            onClick={() => votar(band.id)}
                        > +1 </button>
                    </td>
                    <td>
                        <input
                            className='form-control'
                            value={band.name}
                            onChange={(event) => cambioNombre(event, band.id)}
                            onBlur={() => onPerdioFoco(band.id, band.name)}
                        />
                    </td>
                    <td> <h3> {band.votes} </h3> </td>
                    <td>
                        <button
                            className='btn btn-danger'
                            onClick={() => borrarBanda(band.id)}
                        > Borrar </button>
                    </td>
                </tr>
            ))
        )
    }

    return (
        <>
            <h3> Bandas Actuales </h3>
            <table className='table table-stripped'>
                <thead>
                    <tr>
                        <th></th>
                        <th>Nombre</th>
                        <th>Votos</th>
                        <th>borrar</th>
                    </tr>
                </thead>
                <tbody>
                    {crearRows()}
                </tbody>
            </table>
        </>
    )
}
