import xml2js from "xml2js";
import { createFileListDate, creatFileListEmployeOfDate, extraDataDiv, getAllLines, updateFile } from "./action.js";
import { menu } from "./menu.js";


const url_base = 'https://casadosdados.com.br/sitemapsd/'
let dateDefined;

/**
 * recupera informações da emrpesa
 * CNPJ, EMAIL, CONTATO, ENDEREÇO, ESTADO, CIDADE etc
 * @param {*} data link
 */
const getDataCompany = async (data) => {
  try {
    console.log(".... consultando ....");
    const companyData = await fetch(data);
    const rs = await companyData.text();

    //await extractData(rs);
    let info = await extraDataDiv(rs, data);
  } catch (error) {
    console.log("Error ao recupera dados da empresa");
  }
};

const parseXmlToJson = async (xml) => {
  let rs;
  try {
    const parser = new xml2js.Parser({ explicitArray: false });

    rs = await parser.parseStringPromise(xml);
    /*
    parser.parseStringPromise(xml, (err, result) => {
      if (err) {
        console.error("Erro ao parsear o XML:", err);
        return;
      }
     rs = result;
    });
*/
    return rs;
  } catch (error) {
    console.log("Error no parse XML para JSON ", error);
  }
};

/**
 * nesta função recuperamos todas as empresas que estão
 * registradas em determinado dia, que é informado no parametro
 */
const getFetch = async (link) => {
  try {
    // recupera a lista de empresas para o dia informado
    const rs = await fetch(link);

    if (!rs.ok) throw "Error na request";

    // recupera o texto
    const text = await rs.text();
    
    //parse para json
    const linksOfCompanys = await parseXmlToJson(text);

    if (linksOfCompanys === null || undefined) throw "Nenhum link encontrado";

    // add nova linha ao arquivo, com o link direto com dados do CNPJ
    for (let i = 0; i < linksOfCompanys.urlset.url.length; i++) {
      const element = linksOfCompanys.urlset.url[i].loc;
      await creatFileListEmployeOfDate(element, dateDefined)
      
    }
   
   // aqui recupera as linhas do arquivo contendo os links direto de cada CNPJ
    let lines = await getAllLines(dateDefined)
    const limit = Math.min(10, lines.length);

    // Percorre o array e processa cada linha
    for (let i = 0; i < limit; i++) {
      console.log(
        "\n**** link enviado ****\n",

        lines[i]
      );
      const result = lines.splice(i, 1);
     await updateFile(result, "2025");
     i--;
/*
      // função que extrai os dados da empresa
      await getDataCompany(linksOfCompanys.urlset.url[i].loc);     

      // Aguarda 20 segundos antes da próxima iteração, exceto na última
      if (i < linksOfCompanys.urlset.url.length -1) {
        console.log(`Aguardando 20 segundos antes da próxima consulta...`);
        await new Promise((resolve) => setTimeout(resolve, 20000));
      }
*/
    }
      
    return;
  } catch (error) {
    console.log(error);
  }
};

/**
 * recupera todas as datas disponiveis
 */
const sitemapsd = async () => {
  try {
    const url = "https://casadosdados.com.br/sitemapsd";
    const rs = await fetch(url);

    if (!rs.ok) throw "Error na request";
    const text = await rs.text();

    const json = await parseXmlToJson(text);
    const line = json.sitemapindex.sitemap[1].loc; // posição indica a objeto que cntem a DATA

    console.log(line);
    //getFetch(line);
  } catch (error) {
    console.log(error);
  }
};

const sitemapsddate = async (list) => {
  try {
    // recupera a lista com todas as empresas abertas no dia definido
    const url = "https://casadosdados.com.br/sitemapsd/" + list;

    // get na url montada
    const rs = await fetch(url);

    if (!rs.ok) throw "Error na request";
    const text = await rs.text();

    const json = await parseXmlToJson(text);

    console.log(json.urlset.url.length);
    const line = json.urlset.url[1].loc; // posição indica a objeto que cntem a DATA

    //getFetch(line);
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  dateDefined = await menu();

  // defini a url de busca
  const url = url_base + dateDefined;
  getFetch(url);
  
})();
//sitemapsd();
//getFetch();
