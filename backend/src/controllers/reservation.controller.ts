import { Request, Response } from 'express';
// const db = require("../database/db");
import db from '../database/db';
import { Showing } from '../database/models/showing';

const MAX_SEATS = 10;

// Select all reservations from the database.
export const all = async (req: Request, res: Response) => {
    const reservations = await db.Reservation.findAll();
    res.json(reservations);
};

export const one = async (req: Request, res: Response) => {
    const reservation = await db.Reservation.findByPk(req.params.id);
    if (reservation === null) {
        res.json(null);
    } else {
        res.json(reservation);
    }
}

//  Select one user's reservations
export const user = async (req: Request, res: Response) => {
    const reservations = await db.Reservation.findAll({
        where: {
            userId: req.params.id
        },
        include: [
            {
                model: db.Showing,
                include: [
                    {
                        model: db.Movie,
                        attributes: ['title'],
                        as: 'movie'
                    }
                ],
                attributes: ['time'],
            }
        ]
    });
    res.json(reservations);
}

export const available = async (req: Request, res: Response) => {
    try {
        const showingId = req.params.id;
        
        //  how many reservations for this session?
        const reservedSeats = await db.Reservation.sum('numSeats', {
            where: { showingId: showingId }
        });

        // how many seats available
        const availableCount = Math.max(0, MAX_SEATS - reservedSeats);

        res.json(availableCount);
    } catch (error) {
        res.status(500).json({ error: 'Ben dropped something.' });
    }
}

/* returns the available seats for each showing */

export const allAvailable = async (req: Request, res: Response) => {
    try {
        const seats = await db.AvailableSeats.findAll();
        res.json(seats);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Ben dropped something.' });
    }
}


export const create = async (req: Request, res: Response) => {
    
    //  TODO:   check user is valid.

    //  check the seats are still available.
    //  this should really be done in a transaction or locked somehow
    //  to prevent overselling seats.

    const reservedSeats = await db.Reservation.sum('numSeats', {
        where: { showingId: req.body.showingId }
    });
    
    const availableCount = Math.max(0, MAX_SEATS - reservedSeats);
    
    if (availableCount >= req.body.numSeats) {
        const reservation = await db.Reservation.create({
            // id: req.body.id,
            numSeats: req.body.numSeats,
            showingId: req.body.showingId,
            userId: req.body.userId,
        });
        res.status(200).send(`We have reserved ${req.body.numSeats} seats and look forward to your visit!`);
    } else {
        //  409 request conflicts with current server state
        res.status(409).send(`Unfortunately, there are no longer ${req.body.numSeats} seats available for booking. Please select an alternative time.`);
    }
};
