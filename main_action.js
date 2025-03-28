
import fs from 'fs';
import { promises as fss } from 'fs';
import { carregarDadosEmpresa } from "./get_sitemap.js";
import xml2js from "xml2js";

export async function updatePendingLinks(pendingLinks, filename) {
  try {
    await fss.writeFile(filename, pendingLinks.join("\n"));
    console.log(
      `📄 Arquivo atualizado com ${pendingLinks.length} links pendentes.`
    );
  } catch (error) {
    console.error("Erro ao atualizar arquivo de links pendentes:", error);
    throw error;
  }
}

export const readFilePendingLinks = async (fileName) => {
  try {
    const line = await fss.readFile(fileName, {encoding:'utf-8'});
    const pending = line.split('\n');
    console.log(`📄 Arquivo carregado com ${pending.length} links pendentes.`);
    return line;
  } catch (error) {
    console.error("Erro ao carregar arquivo de links pendentes:", error);
    throw error;
  }
};

export const normalizationText = (element, tagName) => {
  if (tagName === "label") {
    let label = element
      .children("label")
      .text()
      .trimEnd()
      .replaceAll(" ", "_")
      .replaceAll(":", "");
    //console.log(element);
    return label;
  }
};

export const salvarLinksNaoPersistidos = async (link) => {
  try {
    fs.appendFile("./nao_gravados.txt", `${link} \n`, (err) => {
      if (err) throw err;
      console.log(
        "******************   Dados inseridos na lista!!!!  ********************"
      );
    });
  } catch (error) {
    console.log("ocorreu um erro ao tentar salvar o arquivo", error);
    throw error;
  }
};

export const criarListaCnpjPorData = async (lista, dateDefined) => {
  try {
    const stream = fs.createWriteStream(`./${dateDefined}.txt`, { flags: "a" });

    for (let i = 0; i < lista.urlset.url.length; i++) {
      stream.write(`${lista.urlset.url[i].loc}\n`);
    }

    stream.end(() => console.log("✅ Dados gravados com sucesso!"));
    return;
  } catch (error) {
    console.log("ocorreu um erro ao tentar salvar o arquivo", error);
    throw error;
  }
};

export const parseXmlToJson = async (xml) => {
  let rs;
  try {
    const parser = new xml2js.Parser({ explicitArray: false });

    rs = await parser.parseStringPromise(xml);
    return rs;
  } catch (error) {
    console.log("Error no parse XML para JSON ", error);
  }
};

export const fluxoDeCarregamentoPorArquivo = async (links, fileName) => {
  for (let i = 0; i < links.length; i++) {
    const url = links[i];

    console.log(`🔗 Processando: ${url}`);

    await carregarDadosEmpresa(url);
    // Remove o link processado e atualiza o arquivo
    links.splice(i, 1);
    await updatePendingLinks(links, `./${fileName}.txt`);

    // Aguarda 20 segundos antes da próxima iteração, exceto na última
    if (i < links.length - 1) {
      console.log(`Aguardando 20 segundos antes da próxima consulta...`);
      await new Promise((resolve) => setTimeout(resolve, 20000));
    }
  }
};
