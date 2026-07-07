---
title: "Testing"
description: "Unit and integration testing for MCP tools"
order: 12
---

# Testing

## Unit Tests
```javascript
import { tools } from "../server.js";
test("greet works", async () => {
  const result = await tools[0].handler({ name: "World" });
  assert.equal(result.message, "Hello, World!");
});
```