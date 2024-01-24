import axios from 'axios';
import { ReservationResponse } from '../../../types/reservationResponse';
import { Reservation } from '../../../types/reservation';
export const useReservations = () => {
    const fetchRemainingSeatsBySessionId = (sessionId: number): Promise<void> => {
        console.log('fetching remaining seats');
        return fetch(`http://localhost:5001/api/v1/reservation/available/${sessionId}`)
            .then((res) => res.json())
            .then((sessions) => console.log(sessions));
    };

    const fetchAllRemainingSeats = async (): Promise<[{showingId: number, availableCount: number}]> => {
        try {
            console.log('fetching all seats');
            const res = await axios.get('http://localhost:5001/api/v1/reservation/available');
            const data = res.data;

            if (typeof data !== 'object' || data === null) {
                throw new Error('Invalid JSON data');
            }

            return data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    const fetchReservationsByUserId = (userId: number): Promise<Reservation[]> => {
        return axios
            .get(`http://localhost:5001/api/v1/reservation/user/${userId}`)
            .then((res) => {
                console.log(res.data);
                return res.data;
            })
            .catch((error) => {
                console.error("Error retrieving user's reservations:", error);
            });
    };

    const makeReservation = (
        showingId: number,
        userId: number,
        numSeats: number
    ): Promise<ReservationResponse> => {
        //  this is overkill, but i wanted to try making a simple interface
        //  instead of having the component deal with http status codes.
        return axios
            .post(`http://localhost:5001/api/v1/reservation`, {
                numSeats: numSeats,
                showingId: showingId,
                userId: userId,
            })
            .then((response) => {
                const reservationResponse: ReservationResponse = {
                    success: true,
                    message: response.data,
                };
                return reservationResponse;
            })
            .catch((error) => {
                console.error('Error when making reservation:', error);
                if (error.response.status === 409) {
                    const reservationResponse: ReservationResponse = {
                        success: false,
                        message: error.response.data,
                    };
                    return reservationResponse;
                } else {
                    const reservationResponse: ReservationResponse = {
                        success: false,
                        message:
                            'A technical issue occured when trying to make your reservation. Please contact Loop via phone or email to arrange your booking.',
                    };
                    return reservationResponse;
                }
            });
    };

    return {
        fetchAllRemainingSeats,
        fetchRemainingSeatsBySessionId,
        makeReservation,
        fetchReservationsByUserId,
    };
};
