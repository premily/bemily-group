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

        server.dependency('bemily-database', (server, next) => {
            this.db = server.plugins['bemily-database'];
            next();
        });

        this._register(server, options);
        next();
    };

    private _register(server, options) {
        // route to get all groups
        server.route({
            method: 'GET',
            path: '/groups',
            config: {
                handler: (request, reply) => {
                    this.db.getGroups((err, data) => {
                        if (err) {
                            return reply(err).code(400);
                        }
                        reply(data);
                    });
                },
                description: 'Get all groups',
                tags: ['api', 'group']
            }
        });

        // route to create new group
        server.route({
            method: 'POST',
            path: '/groups',
            config: {
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
                },
                description: 'Create new group',
                tags: ['api', 'group'],
                validate: {
                    payload: this.groupSchema
                        .required()
                        .description('Group JSON object')

                }
            }
        });

        // route to get name of specific group
        server.route({
            method: 'GET',
            path: '/groups/{groupid}',
            config: {
                handler: (request, reply) => {
                    this.db.getGroupById(request.params.groupid, (err, data) => {
                        if (err) {
                            return reply(err).code(400);
                        }
                        reply(data);
                    });
                },
                description: 'Get particular group by ID',
                notes: 'group id from "LSF"',
                tags: ['api', 'group']
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