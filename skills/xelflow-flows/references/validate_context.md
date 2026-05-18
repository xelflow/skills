# Validate Context

Validates the context based on several rules. If validation fails, the flow is stopped and the error step of the flow is executed.

## Structure

| Parameter                     | Description                                                                              |
|:------------------------------|:-----------------------------------------------------------------------------------------|
| **Key-Value pair** (req, var) | The Key is the name of the validation rule. The Value is the expression that is checked. |

for variable usage see [Reference: Variables](variables.md) for details.

## Examples
```
"validate-admin-user": {
    "Id": "validate-user",
    "Type": "ValidateContext",
    "Parameters": {
      "UserEnabled": "${NOT(user.Disabled)}",
      "Administrator": "${EQUALS(role.0.Name, 'Admin')}"
    },
    "NextStepId": "do-something"
  },
```
