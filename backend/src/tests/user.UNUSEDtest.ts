// import chai, { expect } from 'chai';
// import chaiHttp from 'chai-http';
// import sinon from 'sinon';
// import jwt from 'jsonwebtoken';
// import { User } from '../database/models/user';
// import app from '../../server';
// import { mockVerifyJWT } from './mocks';

// TODO: CURRENTLY NOT WORKING

// --- Notes on testing ---
// Chai is used for assertions
// Sinon is used for stubbing (mocking functions)
// Chai HTTP is used for making HTTP requests to the API
// Mocha is used for running the tests

// chai.use(chaiHttp);

// describe('User', () => {
// Replace the actual JWT verification function with the mock function
// app.use(mockVerifyJWT);
// it('returns all users', async () => {
//     const res = await chai.request(app).get('/users');
//     expect(res).to.have.status(200);
//     expect(res.body).to.be.an('array');
// });
// it('returns one user', async () => {
//     const res = await chai.request(app).get('/users/1');
//     expect(res).to.have.status(200);
//     expect(res.body).to.be.an('object');
// });
//
// test('stop complaining', () => {});
// ...additional tests...
// });
