export interface IRegister {
    (server:any, options:any, next:any): void;
    attributes?: any;
}

/**
 * structure of group entry in database
 */
export interface IGroup {
    _id: string;
    name: string;
    type: string;
}

export default
class Group {
    db:any;
    joi:any;
    groupSchema:any;
    boom:any;

    constructor() {
        this.register.attributes = {
            name: 'bemily-group',
            version: '0.1.0'
        };
        this.joi = require('joi');
        this.boom = require('Boom');
        this.initSchema();
    }

    private initSchema():void {
        this.groupSchema = this.joi.object().keys({
            _id: this.joi.string().required(),
            name: this.joi.string().required(),
            type: this.joi.string().required().valid('group')
        });
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

        // route to create new group
        server.route({
            method: 'POST',
            path: '/groups',
            handler: (request, reply) => {
                this.joi.validate(request.payload, this.groupSchema, (err, group:IGroup)=> {
                    if (err) {
                        return reply(this.boom.wrap(err, 400, err.details.message));
                    } else {
                        this.db.createGroup(group, (err, data) => {
                            if (err) {
                                return reply(this.boom.wrap(err, 400));
                            }
                            reply(data);
                        });

                    }
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