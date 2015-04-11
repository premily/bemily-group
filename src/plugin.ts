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
        // route to get all groups
        server.route({
            method: 'GET',
            path: '/groups',
            handler: (request, reply) => {
                this.db.getGroups((err, data) => {
                    if (err) {
                        return reply(err).code(400);
                    }
                    reply(data);
                });
            }
        });

        // route to get name of specific group
        server.route({
            method: 'GET',
            path: '/groups/{groupid}',
            handler: (request, reply) => {
                this.db.getGroupById(request.params.groupid, (err, data) => {
                    if (err) {
                        return reply(err).code(400);
                    }
                    reply(data);
                });
            }
        });

        // Register
        return 'register';
    }

    errorInit(error) {
        if (error) {
            console.log('Error: Failed to load plugin:', error);
        }
    }
}