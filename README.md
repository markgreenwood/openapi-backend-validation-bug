# The bug

Scenario:
- The OpenAPI spec denotes a `requestBody` with multiple composite "datum" fields that have a common `Datum` schema also defined in the OpenAPI spec (there are three of these in my example).
- The `Datum` schema has fields `value` (of type `number`) and `unit` (of type enum defined in the OpenAPI spec).
- The example repo for this is here: https://github.com/markgreenwood/openapi-backend-validation-bug

Expected:
- A composite field that fails to validate should report an error with `instancePath` and `schemaPath` that both reflect that field's identity (i.e. contain the name of the invalid field).
- If multiple fields fail validation, there should be multiple errors that each contain the information described above.

Actual:
- If any fields using the `Datum` schema OTHER than the first one in the spec are provided non-numeric values, the error's `schemaPath` reports validation failure with the name of the FIRST field listed that uses the `Datum` schema, not the one that actually failed validation. (In the example, if `weight`is provided a non-numeric value, the `schemaPath` incorrectly reports `distance` as the culprit that failed validation.)
- If multiple fields fail validation, the errors array only contains one error, not all the ones that failed to validate. (In one of the example tests, both `weight` and `temperature` are provided non-numeric values, but only one error is reported and its `schemaPath` incorrectly reports `distance` as being invalid.)

Steps to reproduce:
- Clone or fork the example repo, install dependencies with `npm ci`, and then run `api.test.ts` using `npm run test`. Two of the tests describing the expected behavior above should fail.

# How to reproduce the bug

1. Clone the repository.
2. Run the `api.test.ts` (execute `npm run test`).
3. Two of the tests describing the expected behavior will fail.