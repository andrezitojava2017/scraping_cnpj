import * as cheerio from "cheerio";
import { insertData } from "./repository.js";
import fs from 'fs/promises';


const normalizationText = (element, tagName) => {
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

export const extraDataDiv = async (html, link) => {
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
       await createFileListDate(link);
    }

    // Retorna os dados extraídos independentemente do resultado da inserção no banco
    return info;
  } catch (error) {
    console.log("Erro ao acessar elementos HTML");
    console.log(error);
    return {}; // Retorna objeto vazio em caso de erro para evitar null/undefined
  }
};

export const createFileListDate = async (list) =>{
  try {


    fs.appendFile('./nao_gravados.txt', `${list} \n`, (err)=>{
      if(err) throw err
      console.log('******************   Dados inseridos na lista!!!!  ********************')
    });
    
  } catch (error) {
    console.log('ocorreu um erro ao tentar salvar o arquivo', error)
    throw error
  }
}

export const creatFileListEmployeOfDate = async (linkList, dateDefined) =>{
  try {

    await fs.appendFile(`./${dateDefined}.txt`, `${linkList} \n`, (err)=>{
      if(err) throw err
      console.log('******************   Arquivo com vetor criado!!!!  ********************')
    });
    
  } catch (error) {
    console.log('ocorreu um erro ao tentar salvar o arquivo', error)
    throw error
  }
}

export const updateFile = async (linkList, dateDefined) =>{
  try {
    for (const element of linkList) {
      // Adiciona cada linha ao arquivo
      await fs.appendFile(`./${dateDefined}.txt`, `${element}\n`);
      console.log('****************** Arquivo atualizado! ********************');
    }
  } catch (error) {
    console.error('Ocorreu um erro ao tentar salvar o arquivo:', error);
    throw error;
  }
}

export const getAllLines = async (dateDefined)=>{
  try {
    const line = await fs.readFile(`./${dateDefined}.txt`,{encoding:'utf8'})
    const array = line.split('\n')
    return array;
    
  } catch (error) {
    console.log('Erro ao ler arquivo para fazer loop')
    throw error
  }
}
