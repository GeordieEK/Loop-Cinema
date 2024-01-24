import './styles/Bomfunk.css';
import './styles/Home.css';
import Carousel from './Carousel';
import NowShowing from './NowShowing';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import ReservationDialog from './ReservationDialog';

function Home() {
    const { auth: getUser } = useAuth();
    const [reservation, setReservation] = useState({visible: false, showingId: -1, showingTime: "00:00", movieTitle: "Unknown film", moviePreviewImage: ''});
    const [seatsDirty, setSeatsDirty] = useState(false);    //  lol. had to call it this. used when reservation booked, refresh seat #s

    const setSeatsDirtyTrue = () => {
        setSeatsDirty(true);
    }

    useEffect(() => {
        if (getUser) {
            console.log('current logged in user: ' + getUser.name);
        }
    }, [getUser]);

    const showReservationForm = (showingId: number, showingTime: string, movieTitle: string, moviePreviewImage: string) => {
        setReservation({visible: true, showingId: showingId, showingTime: showingTime, movieTitle:movieTitle, moviePreviewImage: moviePreviewImage});
        const reservationDialog: HTMLDialogElement = document.getElementById('reservationDialog') as HTMLDialogElement;
        reservationDialog.showModal();
    }

    return (
        <>
            <section>
                <ReservationDialog movieTitle={reservation.movieTitle} showingTime={reservation.showingTime} showingId={reservation.showingId} availableSeats={10} setSeatsDirty={setSeatsDirtyTrue} moviePreviewImage={reservation.moviePreviewImage}/>
                <Carousel />
                <NowShowing showReservationForm={showReservationForm} seatState={[seatsDirty, setSeatsDirty]}/>
            </section>
        </>
    );
}

export default Home;
