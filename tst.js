import xml2js from "xml2js";
import { createFileListDate, extraDataDiv } from "./action.js";
import { menu } from "./menu.js";

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
    //const url = link;
    const rs = await fetch(link);

    if (!rs.ok) throw "Error na request";

    const text = await rs.text();
    const linksOfCompanys = await parseXmlToJson(text);

    if (linksOfCompanys === null || undefined) throw "Nenhum link encontrado";

    for (let i = 0; i < linksOfCompanys.urlset.url.length; i++) {
      console.log(
        "\n**** link enviado ****\n",

        linksOfCompanys.urlset.url[i].loc
      );

      // Chama getDataCompany para o link atual
      await getDataCompany(linksOfCompanys.urlset.url[i].loc);

     

      // Aguarda 20 segundos antes da próxima iteração, exceto na última
      if (i < linksOfCompanys.urlset.url.length -1) {
        console.log(`Aguardando 20 segundos antes da próxima consulta...`);
        await new Promise((resolve) => setTimeout(resolve, 20000));
      }

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
  const list = await menu();

  // defini a url de busca
  const url = "https://casadosdados.com.br/sitemapsd/" + list;

  getFetch(url);
})();
//sitemapsd();
//getFetch();
