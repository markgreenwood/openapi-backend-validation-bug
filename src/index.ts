import { appFactory } from "./appFactory.js";

function main() {
  const server = appFactory();

  server.listen(3000, () => {
    console.log("Listening on port 3000");
  });
}

main();
