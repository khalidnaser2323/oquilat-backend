const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;



describe('Product Controllers Service', () => {

    it('Should return 4', async () => {
        const data = 4;
        expect(data).eql(4);
    })
});
