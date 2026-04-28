# Query Database

This section provides guidance on querying databases within Xelflow flows. It covers the syntax and usage of database queries in flow steps.

## Structure 

| Parameter                 | Description                                                                                                                                                       |
|:--------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **QueryType** (req)       | Use `Select` when the query returns a result set, use other Query types like `Insert`, `Update`, `Delete`, etc, when the query only returns affecting rows count. |
| **QueryTextType** (req)   | Type of query: `Text`, `Dynamic`.                                                                                                                                 |
| **Query (Text)** (req)    | The SQL query to be executed. Use `@ParameterName` for parameters.                                                                                                |
| **Query (Dynamic)** (req) | a JSON object with an Array of parts, the final sql is created by concatenating the parts where the condition is met or missing.:                                 |
|                           | - `Sql`: SQL string with @Param placeholders.                                                                                                                     |
|                           | - `Part`: SQL query part, like `Select`, `From`, `Where`, `GroupBy`, `OrderBy`, `Limit`.                                                                          |
|                           | - `Conditions`: Optional conditions for the query part.                                                                                                           |
| **Parameters** (req, var) | Object that maps values to SQL parameters. You can use Variables and Functions here, e.g. `${event.data.limit}`.                                                  |

req = required, var = variable, opt = optional

## Examples
### Simple Select with pagination
```
"get-step":
{
    "Id": "get-step",
    "Type": "QueryDatabase",
    "Parameters": {
        "QueryType": "Select",
        "QueryTextType": "Text",
        "Query": "SELECT * FROM MyTable ORDER BY Id OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY",
        "Alias": "items",
        "Parameters":
        {
            "Offset": "${event.data.offset}",
            "PageSize": "${event.data.pageSize}"
        }
    },
    "NextStepId": "send-success-step"
}    
```
### Simple Insert
```
"save-step": {
      "Id": "save-step",
      "Type": "QueryDatabase",
      "Parameters": {
        "QueryType": "Insert",
        "QueryTextType": "Text",
        "Query": "INSERT INTO MyTable (Value) VALUES (@Value)",
        "Parameters": { "Value": "${event.data.value}" }
      },
      "NextStepId": "notify-step"
    },
```
### Insert with returning id
```
"save-step": {
      "Id": "save-step",
      "Type": "QueryDatabase",
      "Parameters": {
        "QueryType": "Select",
        "QueryTextType": "Text",
        "Query": "INSERT INTO MyTable (Value) OUTPUT INSERTED.Id VALUES (@Value)",
        "Alias": "inserted",
        "Parameters": { "Value": "${event.data.value}" }
      },
      "NextStepId": "send-success-step"
    },
"send-success-step": {
    "Id": "send-success-step",
    "Type": "SendMessageToUser",
    "Parameters": {
        "Event": "ItemSaved",
        "Data": { "Status": "Success", "Id": "${inserted.0.Id}" }
    },
    "NextStepId": null
},
```
### Dynamic Query
```
"get-users-step": {
            "Id": "get-users-step",
            "Type": "QueryDatabase",
            "Parameters": {
                "QueryType": "Select",
                "QueryTextType": "Dynamic",
                "Query": [
                    {
                        "Sql": "SELECT Users.Id, Users.FirstName, Users.LastName, Users.Email, Users.LastLogin, Users.Oid, Users.Disabled, STRING_AGG(Roles.Name, ', ') AS Roles ",
                        "Part": "Select"
                    },
                    {
                        "Sql": "FROM Users LEFT JOIN UserRoles ON Users.Id = UserRoles.UserId LEFT JOIN Roles ON UserRoles.RoleId = Roles.Id",
                        "Part": "From"
                    },
                    {
                        "Sql": "WHERE (FirstName LIKE @Search OR LastName LIKE @Search OR Email LIKE @Search)",
                        "Part": "Where",
                        "Conditions": "@Search != %%"
                    },
                    {
                        "Sql": "GROUP BY Users.Id, Users.FirstName, Users.LastName, Users.Email, Users.LastLogin, Users.Oid, Users.Disabled",
                        "Part": "GroupBy"
                    },
                    {
                        "Sql": "ORDER BY LastLogin DESC",
                        "Part": "OrderBy"
                    },
                    {
                        "Sql": "OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY",
                        "Part": "Limit"
                    }
                ],
                "Parameters": {
                    "Search": "%${event.data.search}%",
                    "Offset": "${event.data.offset}",
                    "Limit": "${event.data.limit}"
                }
            },
            "Alias": "users",
            "NextStepId": "count-users-step",
            "AuthenticationId": 0
        },
```