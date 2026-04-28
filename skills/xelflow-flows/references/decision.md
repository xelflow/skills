# Decision

Makes a decision based on a condition. If the condition is true, the `TrueStepId` is executed. If not true, the `FalseStepId` is executed.

## Structure

| Parameter                | Description                                                                                                            |
|:-------------------------|:-----------------------------------------------------------------------------------------------------------------------|
| **Condition** (req, var) | The condition being evaluated. The condition is usually a function or an variable like `${GREATER(COUNT(existing),0)}` |
| **TrueStepId** (req)     | The step executed if the condition is true.                                                                            |
| **FalseStepId** (req)    | The step executed if the condition is false.                                                                           |
req=required, var=variable, opt=optional

## Example
```
"decision-step": {
    "Id": "decision-step",
    "Type": "Decision",
    "Parameters": {
        "Condition": "${NOT(EMPTY(AccessCheck.0))}",
        "TrueStepId": "create-location-step",
        "FalseStepId": "error-step"
    },
    "NextStepId": "${decision-step}"
},
```