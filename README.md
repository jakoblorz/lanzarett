# lanzarett

[![Build Status](https://travis-ci.org/jakoblorz/lanzarett.svg?branch=master)](https://travis-ci.org/jakoblorz/lanzarett)

**lanzarett** is targeting teams that need to code an api as fast as possible - using endpoint-contracts, the requirements of each endpoint can 
be determined easily to start a server and invoke the endpoint-functions upon request or to generate the client-sdks.
Adding new functionality is super straight-forward: add the contract-file and regenerate the sdks - no slowing down the teams performance!

**NOTICE: THIS LIBARAY IS JUST PARTIALLY WORKING - DO NOT USE YET**

## current state sample
the idea is to simplify backend programming by specifying which methods of a class are
accessible and what they return so that client-sdks can be generated without 
requiring any knowledge about http communication
```typescript
import { ServiceEndpointNamespace } from "lanzarett";
import { Database } from "./data";

interface IUserEntry {
    name: string;
    age: number;
    password_hash: string;
    password_salt: string;
    date: Date;
};

export default new (class UserNamespace extends ServiceEndpointNamespace {

    constructor(){
        super("user");

        // register the createNewUser method as an endpoint method, that will
        // respond to a request with an IUserEntry object
        super.register<IUserEntry>("create", "createNewUser", this.createNewUser, {
            name: "sample",
            age: 21,
            password_hash: "sdfaf",
            password_salt: "asd3G",
            date: Date.now()
        });
    }

    public async createNewUser(username: string, age: number, password: string) {

        // establish a connection to a fictional database
        const connection = await Database.connect("localhost");

        // create a user
        const user: IUserEntry = {
            name: username,
            age: age,
            password_hash: hash(password),
            password_salt: salt(hash(password)),
            date: Date.now()
        };

        // await the database insertion
        await connection.insert(user).run();

        // return the newly created user
        return user;
    }
})();
```
