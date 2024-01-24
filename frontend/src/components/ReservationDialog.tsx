import './styles/Bomfunk.css';
import './styles/NowShowing.css';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useReservations } from '../hooks/useReservations';

/*
    ReservationDialog displays a modal form for the user to select the number of
    movie session seats they wish to reserve and book them.
*/

interface ReservationDialogProps {
    movieTitle: string,
    moviePreviewImage: string,
    showingTime: string,
    showingId: number,
    availableSeats: number,
    setSeatsDirty: () => void
}

export default function ReservationDialog({
    movieTitle,
    moviePreviewImage,
    showingTime,
    showingId,
    availableSeats,
    setSeatsDirty
}: ReservationDialogProps) {
    const { auth: getUser } = useAuth();
    const { makeReservation } = useReservations();
    const currentUser = getUser;
    const [numSeats, setNumSeats] = useState(1);
    const [reservationResponse, setReservationResponse] = useState(null);

    const handleNumSeatsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNumSeats(event.target.valueAsNumber);
    }

    const submitReservation = () => {
        makeReservation(showingId, currentUser.id, numSeats)
            .then((response) => {
                setReservationResponse(response);
            });
    }

    const closeReservation = () => {
        const reservationDialog: HTMLDialogElement = document.getElementById('reservationDialog') as HTMLDialogElement;
        reservationDialog.close();
        setReservationResponse(null);
        setNumSeats(1);
        setSeatsDirty();
    }

    return (
        <dialog id='reservationDialog' className='modal contrast-container-img'>
            <div className="background-image" style={{backgroundImage: `url(${moviePreviewImage})`}}></div>
            <button type="button" className="contrast-img float-right" onClick={closeReservation}>
                Close
            </button>
            <h3>Seat reservation</h3>
            <h2>{movieTitle}</h2>
            <h2>{showingTime} today</h2>
            {currentUser ? (
                <>
                    {(!reservationResponse || !reservationResponse.success) &&
                        <>
                            <div className='input-container'>
                                <label htmlFor='numSeats' className='white'>Number of seats</label>
                                <input
                                    id="numSeats"
                                    type="number"
                                    value={numSeats}
                                    min="1"
                                    max={availableSeats}
                                    onChange={handleNumSeatsChange}
                                />
                            </div>
                            <div>
                                <button type="button" className="contrast-img" onClick={submitReservation}>
                                    Make reservation
                                </button>
                            </div>
                        </>
                    }
                    {reservationResponse && <p>{reservationResponse.message}</p>}
                </>
            ) : (
                <>
                    <p className='white'>Sign in to reserve your seat!</p>
                </>
            )}
        </dialog>
    );
}
