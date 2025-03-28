import * as cheerio from "cheerio";
import { insertData } from "./repository.js";
import { criarListaCnpjPorData, normalizationText, parseXmlToJson, salvarLinksNaoPersistidos } from "./main_action.js";


/**
 * recupera informações da emrpesa
 * CNPJ, EMAIL, CONTATO, ENDEREÇO, ESTADO, CIDADE etc
 * @param {*} data link
 */
export const carregarDadosEmpresa = async (data) => {
  try {
 
    const companyData = await fetch(data);
    const rs = await companyData.text();

    //await extractData(rs);
    let info = await extrairDadosSalvarNaBase(rs, data);
  } catch (error) {
    throw new Error("Error ao recupera dados da empresa")
  }
};



  
export const extrairDadosSalvarNaBase = async (html, link) => {
  try {
    const $ = cheerio.load(html);
    let info = {};

    // Extrair informações diretamente, sem usar Promise desnecessária
    const divs = $("div.p-3");
    divs.each((i, item) => {
      let label = normalizationText($(item), "label");
      if (label) {
        info[label] = $(item).children("p").text();
      }
    });

    console.log("Dados extraídos: ", info.CNPJ);
    
    // Se o objeto tiver propriedades, tenta inserir no banco de dados
    if (Object.keys(info).length > 0) {
      try {
        await insertData(info);
        console.log("Dados inseridos com sucesso no banco de dados");
        console.log('*************************');
      } catch (dbError) {
        console.log("Erro ao inserir dados no banco de dados");
        console.log(dbError);
        // Mesmo com erro no banco, continuamos retornando os dados para possível salvamento em CSV
      }
    } else {
      console.log("Nenhum dado extraído para inserir");
       // cria arquivo com a lista de datas
       await salvarLinksNaoPersistidos(link);
    }

    // Retorna os dados extraídos independentemente do resultado da inserção no banco
    return info;
  } catch (error) {
    console.log("Erro ao acessar elementos HTML");
    console.log(error);
    return {}; // Retorna objeto vazio em caso de erro para evitar null/undefined
  }
};



export const getListaLinksDeCnpj = async (url, date) => {
  try {
    //const url = url;
    const rs = await fetch(url);

    if (!rs.ok) throw "Error na request";

    const text = await rs.text();
    const linksOfCompanys = await parseXmlToJson(text);

    if (linksOfCompanys === null || undefined) throw "Nenhum link encontrado";

    await criarListaCnpjPorData(linksOfCompanys,date)

    return;
  } catch (error) {
    console.log(error);
    throw error;
  }
};