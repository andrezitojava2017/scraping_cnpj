import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export const menu = async () => {
  try {
    const msg = `********************
***   SCRAPING   ***
********************`;

    console.log(msg);
    const system = readline.createInterface({ input, output });
    const dateDefined = await system.question(
      "Informe a data que deseja buscar (ex: 2025-03-12) "
    );

    system.close();
    return dateDefined;
  } catch (error) {
    console.log("Ocorreu um erro no menu", error);
  }
};
