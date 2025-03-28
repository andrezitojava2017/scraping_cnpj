import { carregarDadosEmpresa, getListaLinksDeCnpj } from "./get_sitemap.js";
import { fluxoDeCarregamentoPorArquivo, readFilePendingLinks, updatePendingLinks } from "./main_action.js";
import { menu, optionsMenu, selecionarNomeArquivo } from "./menu.js";

export const main = async () => {
  let links;
  try {
    const opt = await optionsMenu();

    //inicia fluxo com a leitura de arquivos pendentes
    if (opt === "y" || opt === "Y") {

      const fileName = await selecionarNomeArquivo();
      const savedLinks = await readFilePendingLinks(`./${fileName}.txt`);
      links = savedLinks.split("\n").filter(Boolean);

      console.log("🔄 Retomando links pendentes.");

      await fluxoDeCarregamentoPorArquivo(links, fileName)
    } else {

        const date = await menu();
        
          // defini a url de busca
        const url = "https://casadosdados.com.br/sitemapsd/" + date;
        console.log(url)
        await getListaLinksDeCnpj(url, date)
    }

    console.log("🎉 Processo concluído!");
  } catch (error) {
    console.log("Erro ocorrido ", error);
  }
};

main();
