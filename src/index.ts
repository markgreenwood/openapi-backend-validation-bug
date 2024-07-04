function getAThing(): Promise<string> {
  return Promise.resolve("a thing");
}

async function main() {
  const aThing = await getAThing();
  console.log(aThing);
}

await main();
