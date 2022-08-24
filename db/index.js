const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const jsonfile = require('jsonfile');
const utils = require('../helpers/utils');
const DB_RETRIES = 30;
const DB_WAIT_TIME = 2000;

class Database {
    constructor() {
        this._initialized = false;
        this._connection = undefined;
        this._retries = 0;
    }

    /**
     * Register all models in ./models directory
     * Note: Does not work recursively
     * @private
     */
    async _registerPlugins() {
        await new Promise((resolve, reject) => {
            const pluginsDir = 'plugins';
            const dir = path.join(__dirname, pluginsDir);
            fs.readdir(dir, (err, files) => {
                if (err) {
                    return reject(err);
                }

                for (let i = 0; i < files.length; i += 1) {
                    const plugin = require(path.join(dir, files[i]));
                    mongoose.plugin(plugin);
                }

                resolve();
            });
        });
    }

    async _registerModels() {
        require('./models/user');
        require('./models/search');
        require('./models/city');
        require('./models/area');
        require('./models/complaint');
        require('./models/subscriptions');
        require('./models/bundles');
        require('./models/payments');
        require('./models/allowedAreas');
        require('./models/faq');
    }

    async _connect(uri, options) {
        try {
            await new Promise((resolve, reject) => {
                mongoose.connect(uri, options)
                    .then(
                        () => resolve(),
                        err => reject(err),
                    );
            });
            // Only apply index & configurations first time
            const collections = await this.getCollections();
            if (collections && collections.length === 0) {
                await this.ensureIndexes();
                await this.initializePreConfig();
            }

        } catch (err) {
            if (this._retries >= DB_RETRIES) {
                console.log('Waiting timeout');
                throw err;
            }

            this._retries += 1;
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log(`Waiting for database, Reason: ${err.message}`);
                    resolve(this._connect(uri, options));
                }, DB_WAIT_TIME);
            });
        }
    }

    async initialize(dbConfig) {
        console.log('dbConfig', dbConfig)
        if (this._initialized) {
            return;
        }

        // Register plugins
        await this._registerPlugins();

        // Register models
        await this._registerModels();

        // Connect to mongodb
        this._config = dbConfig;
        const uri = dbConfig.url;
        console.log(uri);
        const options = {
            autoIndex: false, // Don't build indexes "Production"
            // reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
            // reconnectInterval: 1000, // Reconnect every 500ms
            poolSize: 10, // Maintain up to 10 socket connections
            // If not connected, return errors immediately rather than waiting for reconnect
            bufferMaxEntries: 0,
            useNewUrlParser: true,
            useUnifiedTopology: true
        };

        await this._connect(uri, options);

        this._initialized = true;
        this._connection = mongoose.connection;
    }

    get isInitialized() {
        return this._initialized;
    }

    get connection() {
        return this._connection;
    }

    async close() {
        return new Promise((resolve) => {
            this._connection.close(() => {
                resolve();
            });
        });
    }

    async getCollections() {
        try {
            const { connections } = mongoose;
            if (connections && connections.length > 0) {
                const { db } = connections[0];
                const collections = await db.listCollections().toArray();

                return collections;
            }

            return undefined;
        } catch (err) {
            return undefined;
        }
    }

    async ensureIndexes() {
        const { models } = mongoose;
        const promises = [];
        for (const model in models) {
            promises.push(models[model].createIndexes());
        }

        await Promise.all(promises);
    }

    async initializePreConfig() {
        const User = require('./models/user');
        const admin = await new User({
            email: 'mfarhat437@gmail.com',
            name: 'Farhat',
            mobile: '+201142100770',
            roles: ['admin'],
        });
        await admin.save();
        const guest = await new User({
            email: '',
            name: 'guest',
            mobile: '+1',
            roles: ['guest'],
        });
        await guest.save();

        // const aFile = utils.getPath(__dirname, '../data/accounts.json');
        // jsonfile.writeFile(aFile, {
        //     admin,
        // }, (err) => {
        //     if (err) {
        //         console.error(err);
        //     }
        // });
    }
}

module.exports = new Database();
