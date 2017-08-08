# lanzarett
this library helps **you** to create a **fast** and **reliable** **api** for your next hit app within minutes

**NOTICE: THIS LIBARAY IS JUST PARTIALLY WORKING - DO NOT USE YET**

## core components
**lanzarett** uses a file structure, where each file that exports a so called **endpoint-contract** represents a single function that can be invoked remotely. 

#### contract-roles
Each endpoint-contract has a specified role which can be one of the following:

- `create`: creates a resource in the database
- `read`: responds with a resource from the database
- `update`: updates a entry in the database
- `delete`: removes a entry from the database
- `ping`: custom purpose - check for incoming messages for the user, update user position on the map, etc.

#### contract-names
A endpoint-contract should carry a unique name (e.g. `getUserName`) also. This name will be the name of the associated client-sdk's function that invokes this endpoint.

### example 1
```typescript
import { EndpointContract } from "lanzarett";
export default new EndpointContract(
    /* name */ "getUserName", 
    /* role */ "read", 
    /* function */ async function(app, id){
    return "bob";
});
```

This example is pretty straight forward: this contract specifies a function that is called getUserName and is of the role "read". The function associated expects one id argument (id) from the client, the app argument will be injected and is a KeyValueStore. When a request was recieved that contains an argument "id", the name "getUserName" and is of the role "read", this function will be executed and the result sent back to the client.

### example 2
```typescript
import { EndpointContract, MiddlewareContract } from "lanzarett";

// middlware to connect and disconnect to database
const loadDatabase = new MiddlewareContract(
    /* name */ "db",
    /* before */ async function(){

        return await DB.connect("localhost"); // connect to database

    }, 
    /* after */ async function(db){

        return await db.close(); // disconnect database
});

export default new EndpointContract(
    /* name */ "getUserName", 
    /* role */ "read", 
    /* function */ async function(app, id) {

        const database = app.get("db"); // result of the middleware "db"
        return await database.getFromId(id).username;

    }, 
    /* middleware */ [loadDatabase]);
```

This example is more complicated: this contract gets the result from a database that first needs to be connected and disconnected afterwards. This is achived by using a middlware contract.
