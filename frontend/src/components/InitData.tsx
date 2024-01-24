// import { useLocalStorage } from '../hooks/useLocalStorage';
// import { useContext } from 'react';
// import { AuthContext } from '../hooks/useAuth';

// // Review data
// const initReviews = {
//     0: {
//         movieId: 1,
//         userId: 0,
//         date: new Date('2023-07-10T00:00:00.000Z'),
//         title: 'Loved it',
//         rating: 5,
//         body: 'Such an amazing movie omg',
//     },
//     1: {
//         movieId: 0,
//         userId: 1,
//         date: new Date('2023-05-30T00:00:00.000Z'),
//         title: 'Hated it',
//         rating: 1,
//         body: '1 is the lowest rating I could give',
//     },
//     2: {
//         movieId: 0,
//         userId: 0,
//         date: new Date('2023-06-09T00:00:00.000Z'),
//         title: 'THE BEST!!!!1',
//         rating: 4,
//         body: "CAN'T BELEV U ONLY GAVE IT ONE THIS IS THE BEST",
//     },
//     3: {
//         movieId: 9,
//         userId: 2,
//         date: new Date('2023-08-03T00:00:00.000Z'),
//         title: 'True story',
//         rating: 5,
//         body: 'I know this guy in real life, he was a machine...',
//     },
// };

//  User data

// const testUsers = {
//     0: {
//         id: 0,
//         email: 'john@something.com',
//         name: 'Big John',
//         date_joined: new Date('2023-04-24'),
//         password: 'john1234',
//     },
//     1: {
//         id: 1,
//         email: 'bertie@beetle.com.au',
//         name: 'Bertie Beetle',
//         date_joined: new Date('2022-03-13'),
//         password: 'beetle',
//     },
//     2: {
//         id: 2,
//         email: 'ken@western-star.com.au',
//         name: 'Buttery Ken',
//         date_joined: new Date('2023-08-01'),
//         password: 'itsbuttertime',
//     },
// };

// const testUserIdsByEmail = {
//     'john@something.com': 0,
//     'bertie@beetle.com.au': 1,
//     'ken@western-star.com.au': 2,
// };

export const InitData: React.FC = () => {
    //TODO: Commented out, don't think we need this anymore
    // //  load the default reviews
    // const [, setNextReviewId] = useLocalStorage('nextReviewId', 0);
    // const [, setReviews] = useLocalStorage('reviews', '');

    // // Check if 'reviews' exists in localStorage
    // if (localStorage.getItem('reviews') === null) {
    //     // If 'reviews' doesn't exist, initialize it
    //     setReviews(initReviews);
    //     setNextReviewId(2);
    // }

    // //  load the default users
    // const auth = useContext(AuthContext);
    // const { setUserData, setUserIdsByEmail } = auth;

    // if (localStorage.getItem('userData') === null) {
    //     setUserData(testUsers);
    // }

    // if (localStorage.getItem('userIdsByEmail') === null) {
    //     setUserIdsByEmail(testUserIdsByEmail);
    // }

    // Return null because this component does not render anything
    return null;
};
