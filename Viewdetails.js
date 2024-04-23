import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AllContacts() {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch bookings
        axios.get("http://localhost:8070/Bookingdetail/getcontactdetails")
            .then((res) => {
                setBookings(res.data);
            })
            .catch((err) => {
                setError(err.message);
            });
    }, []);

    const handleDelete = (id) => {
        axios.delete(`http://localhost:8070/Bookingdetail/deletecontact/${id}`)
            .then(() => {
                setBookings(bookings.filter(booking => booking._id !== id));
            })
            .catch((err) => {
                setError(err.message);
            });
    };

    const contentStyle = {
        backgroundColor: "#A38469",
        padding: '20px',
    };

    const container = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '700px',
        margin: '0 auto',
    };

    const table = {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '20px',
    };

    const tableThTd = {
        padding: '10px',
        borderBottom: '1px solid #ccc',
    };

    const tableTh = {
        ...tableThTd,
        backgroundColor: '#053F5C',
        color: 'white',
        textAlign: 'left',
    };

    const tableEvenRow = {
        backgroundColor: '#F0EDE5',
    };

    const actionButton = {
        padding: '8px 12px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    };

    const actionButtonHover = {
        backgroundColor: '#0056b3',
    };

    return (
        <div style={contentStyle}>
            <div style={container}>
                <h1 className="text-center">ALL BOOKING DETAILS</h1>

                <table style={table}>
                    <thead>
                        <tr style={{ backgroundColor: '#053F5C', color: 'white' }}>
                            <th style={tableTh}>Name</th>
                            <th style={tableTh}>Email</th>
                            <th style={tableTh}>Mobile No</th>
                            <th style={tableTh}>Date</th>
                            <th style={tableTh}>Message</th>
                            <th style={tableTh}>Package Name</th>
                            <th style={tableTh}>Photographer</th>
                            <th style={tableTh}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {error && <tr><td colSpan="8" style={{ color: 'red' }}>Error: {error}</td></tr>}
                        {bookings.map((booking, index) => (
                            <tr key={index} style={index % 2 === 0 ? tableEvenRow : null}>
                                <td style={tableThTd}>{booking.Name}</td>
                                <td style={tableThTd}>{booking.Email}</td>
                                <td style={tableThTd}>{booking.Mobile_No}</td>
                                <td style={tableThTd}>{booking.dateValidity}</td>
                                <td style={tableThTd}>{booking.Message}</td>
                                <td style={tableThTd}>{booking.Package_Name}</td>
                                <td style={tableThTd}>{booking.Phoname}</td>
                                <td style={tableThTd}>
                                    <button style={actionButton} onClick={() => handleDelete(booking._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
