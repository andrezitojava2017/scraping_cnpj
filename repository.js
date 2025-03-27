import conection from "./src/config/database.js";

export const insertData = async (info) => {
    const sql = `INSERT INTO data (cnpj, razao_social, situacao, abertura, nat_juridica, mei, logradouro, bairro, cep, municipio, uf, email, telefone, cnae_principal, atualizacao) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    try {
      const conn = await conection();
      const [rows] = await conn.query(sql, [
        info.CNPJ,
        info.Razão_Social,
        info.Situação_Cadastral,
        info.Data_de_Abertura,
        info.Natureza_Jurídica,
        info.Empresa_MEI,
        info.Logradouro,
        info.Bairro,
        info.CEP,
        info.Municipio,
        info.Estado,
        info.Email,
        info.Telefone,
        info.CNAE_Principal,
        info.Ultima_Atualização
      ]);
      if ((rows).affectedRows > 0) return (rows).insertId;
    } catch (error) {
      console.log(
        "Erro ocorrido: função inserir dados - file: repository.js"
      );
      console.log(error);
      throw new Error(messages.inesperado);
    }
  };