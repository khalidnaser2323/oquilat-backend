const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const BaseTest = require('./BaseTest');
const server = require('../../app.js');
const fs = require('fs');
const faker = require('faker');
chai.use(chaiHttp);
let categories;
before(async () => {
    console.log('Starting server');
    await server.start();
});

after(async () => {
    console.log('stop Server');
    await server.stop();
});

class categoryTest extends BaseTest {
    constructor() {
        super();
    }

    async test() {
        const data = {
            name: faker.name.findName(),
            translation: {
                ar: {
                    name: faker.name.findName()
                }
            }
        };
        const updatedData = {
            name: faker.name.findName(),
            translation: {
                ar: {
                    name: faker.name.findName()
                }
            }
        };

        const file = fs.readFileSync(`${__dirname}/../files/promotion.png`);
        describe('Category Service', () => {
            it('Create Category', async () => {
                return chai.request(`localhost:3000`)
                    .post('/categories')
                    .set('Authorization', this.token)
                    .attach('image', file)
                    .field('data', JSON.stringify(data))
                    .then((res) => {
                        expect(res).to.have.status(200);
                        this.categoryId = res.body._id;
                    })
                    .catch((err) => {
                        throw err;
                    });
            });
            it('List Category', async () => {
                return chai.request(`localhost:3000`)
                    .get('/categories')
                    .set('Authorization', this.token)
                    .then((res) => {
                        if (res.status !== 200) {
                            console.log(res.body);
                        }
                        expect(res).to.have.status(200);
                    })
                    .catch((err) => {
                        throw err;
                    });
            });
            it('Get One category', async () => {
                return chai.request(`localhost:3000`)
                    .get(`/categories/${categories[0]._id}`)
                    .set('Authorization', this.token)
                    .then((res) => {
                        if (res.status !== 200) {
                            console.log(res.body);
                        }
                        expect(res).to.have.status(200);
                    })
                    .catch((err) => {
                        throw err;
                    });
            });
            it('Update Category', async () => {
                return chai.request(`localhost:3000`)
                    .put(`/categories/${categories[0]._id}`)
                    .set('Authorization', this.token)
                    .attach('image', file)
                    .field('data', JSON.stringify(data))
                    .then((res) => {
                        expect(res).to.have.status(200);
                    })
                    .catch((err) => {
                        throw err;
                    });
            });
            it('Delete One category', async () => {
                return chai.request(`localhost:3000`)
                    .delete(`/categories/${categories[0]._id}`)
                    .set('Authorization', this.token)
                    .then((res) => {
                        if (res.status !== 200) {
                            console.log(res.body);
                        }
                        expect(res).to.have.status(200);
                    })
                    .catch((err) => {
                        throw err;
                    });
            });

        });
    }

}

module.exports = new categoryTest();
