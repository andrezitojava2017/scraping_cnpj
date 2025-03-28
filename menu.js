import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const msg = `********************
***   SCRAPING   ***
********************`;

export const menu = async () => {
  try {

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

export const selecionarNomeArquivo = async () => {
  try {

    const system = readline.createInterface({ input, output });
    const dateDefined = await system.question(
      "Informe o nome do arquivo para carregamento  "
    );

    system.close();
    return dateDefined;
  } catch (error) {
    console.log("Ocorreu um erro no menu", error);
  }
};

export const optionsMenu = async ()=>{
  try {

    console.log(msg);

    const system = readline.createInterface({ input, output });
    const option = await system.question(
      "Carregar lista pendente? (Y/N)"
    );

    system.close();
    return option;
  } catch (error) {
    console.log("Ocorreu um erro no menu", error);
  }
}