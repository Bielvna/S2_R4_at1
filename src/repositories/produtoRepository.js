import { connection } from "../config/Database.js";

const produtoRepository = {
    criar:async (produto) => {
        const sql = 'INSERT INTO produtos (Nome, valor, idCategoria, caminhoImg) VALUES(?,?,?,?)';
        const values = [produto.nome, produto.valor, produto.idCategoria, produto.caminhoImg];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },
    editar:async (produto) => {
        const sql = 'UPDATE produtos SET Nome=?, valor=?, idCategoria=?, caminhoImg=? WHERE Id=?;';
        const values = [produto.nome, produto.valor, produto.idCategoria, produto.caminhoImg, produto.id];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },
    deletar:async (id) => {
        const sql = 'DELETE FROM produtos WHERE Id=?;';
        const values = [id];
        const [rows] = await connection.execute(sql, values);
        return rows;
    },
    selecionar:async () => {
        const sql = 'SELECT * FROM produtos;';
        const [rows] = await connection.execute(sql);
        return rows;
    }
}

export default produtoRepository;