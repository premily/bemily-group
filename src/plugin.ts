export interface IRegister {
    (server:any, options:any, next:any): void;
    attributes?: any;
}

export default
class Group {
    db:any;

    constructor() {
        this.register.attributes = {
            name: 'bemily-group',
            version: '0.1.0'
        };
    }

    register:IRegister = (server, options, next) => {
        server.bind(this);

        if (!options.databaseInstance) {
            throw new Error('options.databaseInstance needs to be defined');
        }
        this.db = options.databaseInstance;

        this._register(server, options);
        next();
    };

    private _register(server, options) {
        // Register
        return 'register';
    }

    errorInit(error) {
        if (error) {
            console.log('Error: Failed to load plugin:', error);
        }
    }
}