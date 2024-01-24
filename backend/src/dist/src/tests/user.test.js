"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
// TODO: CURRENTLY NOT WORKING
// --- Notes on testing ---
// Chai is used for assertions
// Sinon is used for stubbing (mocking functions)
// Chai HTTP is used for making HTTP requests to the API
// Mocha is used for running the tests
chai_1.default.use(chai_http_1.default);
describe('User', () => {
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
    test('stop complaining', () => { });
    // ...additional tests...
});
