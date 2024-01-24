import { Sequelize } from 'sequelize';
import { sequelize } from './config';

import initUser, { User } from './models/user';
import initToken, { Token } from './models/token';
import initReview, { Review } from './models/review';
import initMovie, { Movie } from './models/movie';
import initShowing, { Showing } from './models/showing';
import initReservation, { Reservation } from './models/reservation';
import initAvailableSeats, { AvailableSeats } from './models/availableSeats';

import argon2 from 'argon2';
import dotenv from 'dotenv';

dotenv.config();

// Initialise models
initUser(sequelize);
initMovie(sequelize);
initShowing(sequelize);
initReview(sequelize);
initToken(sequelize);
initReservation(sequelize);
initAvailableSeats(sequelize);

interface Db {
    sequelize: Sequelize;
    User: typeof User;
    Review: typeof Review;
    Movie: typeof Movie;
    Showing: typeof Showing;
    Token: typeof Token;
    Reservation: typeof Reservation;
    AvailableSeats: typeof AvailableSeats;
    sync: () => Promise<void>;
}

const db: Db = {
    sequelize,
    User,
    Review,
    Movie,
    Showing,
    Token,
    Reservation,
    AvailableSeats,
    sync: async () => {
        await runAssocations();

        if (false) {
            await sequelize.sync({ force: true });
            await seedData();
            //  Create a view of available seats per showing. Much faster than doing it
            //  for every query.
            const createViewSQL = `
                CREATE VIEW available_seats AS
                SELECT s.id AS showingId, (10 - COALESCE(SUM(r.numSeats), 0)) AS availableCount
                FROM Showings s
                LEFT JOIN Reservations r ON s.id = r.showingId
                GROUP BY s.id;
            `;

            sequelize
                .query(createViewSQL, { raw: true })
                .then(([results, metadata]) => {
                    console.log("View 'available_seats' has been created.");
                })
                .catch((err) => {
                    console.error("Error creating 'available_seats' view", err);
                });
        } else {
            await sequelize.sync();
            await seedData();
        }
    },
};

const runAssocations = async () => {
    // Associations
    db.User.hasMany(db.Review, {
        foreignKey: { name: 'userId', allowNull: false },
        as: 'reviews',
    });

    db.Review.belongsTo(db.User, {
        foreignKey: { name: 'userId', allowNull: false },
    });

    db.Review.belongsTo(db.Movie, {
        foreignKey: { name: 'movieId', allowNull: false },
        onDelete: 'CASCADE',
    });

    db.Movie.hasMany(db.Showing, {
        foreignKey: { name: 'movieId', allowNull: false },
        as: 'showings',
    });

    db.Showing.hasMany(db.Reservation, {
        foreignKey: { name: 'showingId', allowNull: false },
    });

    db.Reservation.belongsTo(db.Showing, {
        foreignKey: { name: 'showingId', allowNull: false },
    });

    db.Movie.hasMany(db.Review, {
        foreignKey: { name: 'movieId', allowNull: false },
        as: 'reviews',
    });

    db.Showing.belongsTo(db.Movie, {
        foreignKey: { name: 'movieId', allowNull: false },
        as: 'movie',
        onDelete: 'CASCADE',
    });

    //TODO user has one or many tokens?
    User.hasMany(Token, {
        sourceKey: 'id',
        foreignKey: 'userId',
        as: 'tokens', // alias
    });

    Token.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'userId',
        as: 'user', // alias
    });
};

async function seedData() {
    // First create users
    const userCount = await db.User.count();

    if (userCount === 0) {
        let hash = await argon2.hash('abc123', { type: argon2.argon2id });
        await db.User.create({
            name: 'mbolger',
            email: 'mbolger@gmail.com',
            password: hash,
            is_restricted: false,
            is_admin: true,
        });

        hash = await argon2.hash('def456', { type: argon2.argon2id });
        await db.User.create({
            name: 'shekhar',
            email: 'skalra@gmail.com',
            password: hash,
            is_restricted: true,
            is_admin: false,
        });
    }

    // Now populate the Movie table
    const movieCount = await db.Movie.count();

    if (movieCount === 0) {
        const movies = [
            {
                id: 16,
                preview_img: '/preview_imgs/birds2.png',
                preview_img_alt:
                    'A man stands inside a giant birdcage, watched over by looming birds.',
                title: 'Birds 2: Rebird (Canary Edition)',
                description:
                    "Experience the chilling legacy in 'Birds 2: Rebird,' an unearthed sequel to Alfred Hitchcock's timeless classic.",
                showings: ['11:00', '15:30', '19:00', '20:40'],
            },
            {
                id: 1,
                preview_img: '/preview_imgs/rain_and_bokeh.png',
                preview_img_alt:
                    'A figure walks away from a rain streaked camera, into a foggy neon city street.',
                title: 'Rain and Bokeh',
                description:
                    'Explore the art and craft of filmmaking in this captivating documentary.',
                showings: ['11:00', '13:00', '17:00', '21:20'],
            },
            {
                id: 2,
                preview_img: '/preview_imgs/sad_in_paris.png',
                preview_img_alt:
                    'On the docks, a woman in warm cap and coat stares directly to the camera..',
                title: 'Sad in Paris',
                description:
                    'Laughter and melancholy intertwine in this unusual satire set in the City of Light.',
                showings: ['10:00', '13:10', '19:30', '20:30', '21:00'],
            },
            {
                id: 3,
                preview_img: '/preview_imgs/down.png',
                preview_img_alt: 'A cartoon girl sits in her attic, looking up wistfully.',
                title: 'Down',
                description:
                    "In this heartwarming sequel, Lucy discovers the power of resilience and the beauty in life's most challenging moments.",
                showings: ['10:00', '11:30', '12:50', '15:00', '17:30', '19:00'],
            },
            {
                id: 4,
                preview_img: '/preview_imgs/apatosaurus.png',
                preview_img_alt: 'A man stands in the centre of a cheerful pastel dinosaur museum.',
                title: 'The Apatosaurus Appreciation Society',
                description:
                    'An idiosyncratic curator revives a forgotten museum honoring the majestic Apatosaurus.',
                showings: ['9:50', '11:00', '13:30', '15:00', '17:30', '19:00', '20:00'],
            },
            {
                id: 5,
                preview_img: '/preview_imgs/slow_train.png',
                preview_img_alt: 'A woman leans against the inside of a train window.',
                title: 'Slow Train',
                description:
                    'A solitary traveler takes a seemingly endless train ride, but not all is as it might seem.',
                showings: ['10:40', '11:40', '21:00'],
            },
            {
                id: 6,
                preview_img: '/preview_imgs/tokyo.png',
                preview_img_alt:
                    'A cyberpunk detective stands in the rain, looking up at a neon sign.',
                title: 'Tokyo Psybercycho 2043',
                description:
                    'A relentless cyber-enhanced detective, Yohei Sato, is confronted with a new breed of criminal.',
                showings: ['19:40', '20:10', '21:30'],
            },
            {
                id: 7,
                preview_img: '/preview_imgs/christmas_ham.png',
                preview_img_alt: 'A young couple wearing Christmas hats stop for a kiss.',
                title: 'Christmas Ham',
                description:
                    'Hallmark Christmas Movie of the Year, starring an AI generated young Tom Hanks.',
                showings: ['12:00', '14:00', '16:00', '18:30', '20:20'],
            },
            {
                id: 14,
                preview_img: '/preview_imgs/enigma.png',
                preview_img_alt: 'A woman wearing a dark shawl in the rain.',
                title: 'Cloaked in Destiny',
                description:
                    "Step into a world of 80s-style enchantment with 'Cloaked in Destiny,' a fantasy film that harks back to the era of Excalibur.",
                showings: ['11:15', '21:20'],
            },
            {
                id: 8,
                preview_img: '/preview_imgs/gone_potty.png',
                preview_img_alt: 'A cartoon boy is half-transformed into a toilet.',
                title: 'Gone Potty',
                description: 'A young boy must conquer the ultimate challenge: toilet training.',
                showings: ['10:20', '11:50', '13:10', '15:20', '17:50', '19:20'],
            },
            {
                id: 9,
                preview_img: '/preview_imgs/mr_ping.png',
                preview_img_alt:
                    'In a party, a man wearing a business suit dances and balances a wine glass on his elbow.',
                title: 'Mr. Ping',
                description:
                    'A high-flying executive lives for the neon-lit world of raves, precariously balancing the boardroom and the dance floor.',
                showings: ['19:00', '20:00', '21:00'],
            },
            {
                id: 15,
                preview_img: '/preview_imgs/elegy.png',
                preview_img_alt: 'A picture of a prince in a crown, looking sad.',
                title: 'Elegy of the Crown',
                description:
                    "'Elegy of the Crown' paints a portrait of a prince's emotional journey, exploring the cost of a crown and the pursuit of his own happiness amidst the echoes of ancient traditions.",
                showings: ['9:50', '15:00', '20:10'],
            },
            {
                id: 10,
                preview_img: '/preview_imgs/friends_on_the_savannah.png',
                preview_img_alt: 'A group of giraffes, close up.',
                title: 'Friends on the Savannah',
                description:
                    'Discover the captivating world of giraffes in this stunning documentary.',
                showings: ['10:15', '12:15', '14:30', '17:00', '20:00'],
            },
            {
                id: 0,
                preview_img: '/preview_imgs/old_timey.png',
                preview_img_alt: 'Two old-timey types look up at the sky.',
                title: 'Skybound Shadows',
                description: 'Tensions rise under the vast expanse of the frontier sky.',
                showings: ['14:00', '19:40'],
            },
            {
                id: 11,
                preview_img: '/preview_imgs/camel_up.png',
                preview_img_alt:
                    'A chess-like board game lies on the sand, before a man on a caamel.',
                title: 'Camel Up',
                description:
                    "Roll the dice and join the zany race in 'Camel Up,' a movie adaptation of the beloved board game.",
                showings: ['14:30', '16:50', '19:50'],
            },
            {
                id: 12,
                preview_img: '/preview_imgs/full_stack_the_movie.png',
                preview_img_alt: 'A bespectacled hacker lurks over his computers.',
                title: 'Full Stack: The Movie',
                description:
                    'From coding marathons to quirky office dynamics, this film offers a glimpse into the world of full stack web development.',
                showings: ['14:40', '17:50', '19:00', '21:00'],
            },
            {
                id: 13,
                preview_img: '/preview_imgs/peas.png',
                preview_img_alt: 'A pouty British boy sits at a school dining table.',
                title: 'Peas',
                description:
                    'This mischievous British film centres on a group of young schoolboys who find themselves the constant targets of pranks.',
                showings: ['10:10', '11:40', '13:30', '16:00', '19:00'],
            },
        ];

        for (const movie of movies) {
            const createdMovie = await db.Movie.create({
                preview_img: movie.preview_img,
                preview_img_alt: movie.preview_img_alt,
                title: movie.title,
                description: movie.description,
            });

            for (const showing of movie.showings) {
                await db.Showing.create({
                    movieId: createdMovie.id,
                    time: showing,
                });
            }
        }
    }
    // Create reviews after users and movies due to foreign key constraints
    const reviewCount = await db.Review.count();

    if (reviewCount === 0) {
        const reviews = [
            {
                id: 1,
                userId: 1,
                movieId: 1,
                text: 'Simpler just to have the french.',
                rating: 4,
            },
            {
                id: 2,
                userId: 2,
                movieId: 2,
                text: "I'll be honest with you, I never want to go to the movies. But if I get dragged along by some cucumber, I always enjoy myself. Perhaps I don't understand myself very well.",
                rating: 4,
            },
            {
                id: 3,
                userId: 2,
                movieId: 3,
                text: 'This movie was amazing! I laughed, I cried, and I was on the edge of my seat the entire time.',
                rating: 5,
            },
            {
                id: 4,
                userId: 1,
                movieId: 4,
                text: 'Not my cup of french. I found it quite boring, and the acting was subpar.',
                rating: 2,
            },
            {
                id: 5,
                userId: 1,
                movieId: 5,
                text: 'A classic! I could watch this movie over and over again. Highly recommended.',
                rating: 5,
            },
            {
                id: 6,
                userId: 2,
                movieId: 6,
                text: 'Meh. The movie had its moments, but it could have been so much better.',
                rating: 3,
            },
        ];

        // Add more reviews as needed

        for (const review of reviews) {
            const createdReview = await db.Review.create({
                id: review.id,
                userId: review.userId,
                movieId: review.movieId,
                text: review.text,
                rating: review.rating,
            });
        }
    }

    // Create reservations after users and showings due to foreign key constraints
    const reservationCount = await db.Reservation.count();

    if (reservationCount === 0) {
        const reservations = [
            {
                id: 1,
                userId: 1,
                showingId: 1,
                numSeats: 2,
            },
            {
                id: 2,
                userId: 2,
                showingId: 2,
                numSeats: 3,
            },
            {
                id: 3,
                userId: 1,
                showingId: 3,
                numSeats: 1,
            },
        ];

        for (const reservation of reservations) {
            const createdReservation = await db.Reservation.create({
                id: reservation.id,
                userId: reservation.userId,
                showingId: reservation.showingId,
                numSeats: reservation.numSeats,
            });
        }
    }
}

export default db;
