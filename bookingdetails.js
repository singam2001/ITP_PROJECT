import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AllContacts() {
    const [bookings, setBookings] = useState([]);
    const [photographers, setPhotographers] = useState([]);
    const [error, setError] = useState(null);
    const [selectedPhotographers, setSelectedPhotographers] = useState({});

    useEffect(() => {
        // Fetch bookings
        axios.get("http://localhost:8070/Bookingdetail/getcontactdetails")
            .then((res) => {
                setBookings(res.data);
            })
            .catch((err) => {
                setError(err.message);
            });
        
        // Fetch photographers
        axios.get("http://localhost:8070/api/pho/sup")
            .then((res) => {
                setPhotographers(res.data);
            })
            .catch((err) => {
                console.error("Error fetching photographers:", err);
                setError(err.message); // Set error state
            });

        // Retrieve selected photographers from localStorage on component mount
        const storedSelectedPhotographers = localStorage.getItem('selectedPhotographers');
        if (storedSelectedPhotographers) {
            setSelectedPhotographers(JSON.parse(storedSelectedPhotographers));
        }
    }, []);

    useEffect(() => {
        // Save selected photographers to localStorage whenever it changes
        localStorage.setItem('selectedPhotographers', JSON.stringify(selectedPhotographers));
    }, [selectedPhotographers]);

    const handleDelete = (id) => {
        axios.delete(`http://localhost:8070/Bookingdetail/deletecontact/${id}`)
            .then(() => {
                setBookings(bookings.filter(booking => booking._id !== id));
            })
            .catch((err) => {
                setError(err.message);
            });
    };

    const handleAssignPhotographer = (bookingId) => {
       
        const photographerId = selectedPhotographers[bookingId];
        const photographerName = photographers.find(photographer => photographer._id === photographerId).F_name;
    
        axios.post(
            `http://localhost:8070/Bookingdetail/assign`,
            { bookingId: bookingId, phoname: photographerName }, // Pass bookingId and phoname in the request body
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
        .then((res) => {
            setBookings(prevBookings => prevBookings.map(booking => {
                if (booking._id === bookingId) {
                    console.log(photographerName)
                    return { ...booking, Phoname: photographerName };
                    
                   
                }
                console.log(photographerName)
                return booking;
            }));
        })
        .catch((err) => {
            console.error("Error assigning photographer:", err);
            setError(err.message); // Set error state
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
            <div style={container}> {/* Removed form element */}
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
                               <td style={tableThTd}>
                                       {booking.Phoname ?  booking.Phoname : "Not assigned"}
                                 </td>

                                <td style={tableThTd}>
                                    <select value={selectedPhotographers[booking._id]} onChange={(e) => setSelectedPhotographers({ ...selectedPhotographers, [booking._id]: e.target.value })}>
                                        <option value="">Assign Photographer</option>
                                        {photographers.map((photographer) => (
                                            <option key={photographer._id} value={photographer._id}>{photographer.F_name}</option>
                                        ))}
                                    </select>
                                    <button style={actionButton} onClick={() => handleAssignPhotographer(booking._id)}>Assign</button>
                                </td>
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
