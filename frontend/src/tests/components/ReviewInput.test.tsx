import { validateReview } from '../../components/ReviewInput';

describe('validateReview', () => {
    // Test that validateReview returns error when review fields are empty
    it('should return error when review fields are empty', () => {
        const review = {
            movieId: 1,
            userId: 1,
            User: { id: 1, name: 'Test', email: 'test@test.com' },
            rating: 3,
            text: '',
            date: new Date(),
        };

        expect(validateReview(review, review.rating)).toBe(
            'The text of your review is empty. Please fill in all fields'
        );
    });

    // Test that validateReview validates text field and displays error message
    it('should return error message when text length is more than 600 characters', () => {
        const review = {
            movieId: 1,
            userId: 1,
            User: { id: 1, name: 'Test', email: 'test@test.com' },
            rating: 5,
            text: 'g'.repeat(601),
            date: new Date(),
        };

        expect(validateReview(review, review.rating)).toBe(
            'Please enter a review between 1 and 600 characters'
        );
    });

    // Test that validateReview validates rating field and displays error message
    it('should return error when rating is 0', () => {
        const review = {
            movieId: 1,
            userId: 1,
            User: { id: 1, name: 'Test', email: 'test@test.com' },
            rating: 0,
            text: 'good',
            date: new Date(),
        };

        expect(validateReview(review, review.rating)).toBe('Please select a rating');
    });

    // Add more tests for other validation cases...
});
