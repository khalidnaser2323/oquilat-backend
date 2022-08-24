class BaseTest {
    constructor() {
        this.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZDVhNmUzMWI0ODY5ODYwMTk3MTUzZDMiLCJtb2JpbGUiOiIrMjAxMTI0MTEwNzIyIiwicm9sZXMiOlsiYWRtaW4iXSwiaWF0IjoxNTY2MjA3NTM3fQ.hr8i9C5s3PhtW_LB5KDaElgL8eXU5uDmxNc0wiLEUUY';
        this.test();
    }

    async test() {
        throw 'should implement this first';
    }
}

module.exports = BaseTest;
