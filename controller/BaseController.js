class BaseController {
    constructor(url, type, router) {
        this.url = url;
        this.type = type;
        this.router = router;
    }
}

module.exports = BaseController;
