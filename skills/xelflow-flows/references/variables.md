# Xelflow Flows Variables

This document defines the variables used in Xelflow Flows.

## Structure
A variable is value (string, number, boolean) or a string with interpolation placeholders: \${event.data.field}, \${user.Id}, ${error}
When accessing a field in a list use the index, like this: \${event.data.list.0.field}

Example: 
```
{
   "From": "info@xelflow.com",
   "To": "${user.Email}",
   "Subject": "Welcome to Xelflow",
   "Body": "Welcome to Xelflow ${user.FirstName} \n\n ${event.data.field}"
}
```
In this example, all the fields can be variables. But from and subject are fixed and to and body use interpolation placeholders.

### Functions
Interpolation placeholder also can contain functions: \${functionName(arg1,arg2)} or nested functions: \${functionName(functionName(arg1),arg2)}
List with available functions:

| Function              | Description                                                                                                                          |
|:----------------------|:-------------------------------------------------------------------------------------------------------------------------------------|
| **EMPTY**             | Returns `true` if the value is empty or `null`, otherwise `false`                                                                    |
| **NOT**               | Returns the logical negation of the value.                                                                                           |
| **AND**               | Returns `true` if all values are `true`, otherwise `false`.                                                                          |
| **OR**                | Returns `false` if all values are `false`, otherwise `true`.                                                                         |
| **SUM**               | Returns the sum of all values.                                                                                                       |
| **MIN**               | Returns the minimum of all values.                                                                                                   |
| **MAX**               | Returns the maximum of all values.                                                                                                   |
| **AVG**               | Returns the average of all values.                                                                                                   |
| **NOW**               | Returns the current datetime in UTC or specified TimeZone.                                                                           |
| **TODAY**             | Returns the current date in UTC or specified TimeZone.                                                                               |
| **DATEPART**          | Returns the specified part of the given date: `year`, `month`, `day`, `hour`, `minute`, `second`                                     |
| **EQUALS**            | Returns `true` if the values are equal, otherwise `false`                                                                            |
| **GREATER**           | Returns `true` if the first value is greater than the second value, otherwise `false`                                                |
| **LESS**              | Returns `true` if the first value is smaller than the second value, otherwise `false`                                                |
| **GREATER_OR_EQUAL**  | Returns `true` if the first value is greater than or equal to the second value, otherwise `false`                                    |
| **CONTAINS**          | Returns `true` if the first value contains the second value, otherwise `false`                                                       |
| **LESS_OR_EQUAL**     | Returns `true` if the first value is smaller than or equal to the second value, otherwise `false`                                    |
| **IF_ELSE**           | Returns the first value if the condition is true, otherwise the second value. Syntax: `IF_ELSE(condition, true_value, false_value)`  |
| **FILTER**            | Filters a list based on a filter expression. Syntax: `FILTER(list, 'item', expression)`                                              |
| **CONCAT**            | Joins lists together. Syntax: `CONCAT(list1, list2, ...)`                                                                            |
| **COUNT**             | Returns the number of elements in a list. Syntax: `COUNT(list)`                                                                      |

If you miss a function, recommend it to the user it can probably be added.

### Examples

```
${user.FirstName}
${event.data.field}
${error}
${list.0.field}
${list.1.field}
Total: ${SUM(a, b, c)}
Min: ${MIN(x, y, z)}
${AND(isActive, isVerified)}
${OR(isPremium, isTrial)}
${NOT(isDisabled)}
${EMPTY(email)}
${AND(NOT(EMPTY(firstName)), NOT(EMPTY(lastName)))}
${SUM(MIN(10, 5), MAX(3, 7))}
${DATEPART(datetime, 'year')}
${DATEPART(NOW('W. Europe Standard Time'),'hour')}
${DATEPART(TODAY('W. Europe Standard Time'),'day')}
${GREATER(a, b)}
${FILTER(items, 'item', item.active)}
${FILTER(numbers, 'n', GREATER(n, 25))}
${CONTAINS(text, 'world')}
${COUNT(items)}
```