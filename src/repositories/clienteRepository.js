import { connection } from "../config/Database.js";

const clienteRepository = {

    criar: async (cliente, telefone, endereco) => {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();

            const sqlCli = 'INSERT INTO clientes (Nome, Cpf, DataCad) VALUES (?,?,NOW())';
            const valuesCli = [cliente.nome, cliente.cpf];
            const [rowsCli] = await conn.execute(sqlCli, valuesCli);

            const sqlTel = 'INSERT INTO telefones (idCliente, telefone) VALUES (?,?)';
            const valuesTel = [rowsCli.insertId, telefone.numero];
            await conn.execute(sqlTel, valuesTel);

            const sqlEnd = `
                INSERT INTO enderecos 
                (idCliente, cep, logradouro, numero, complemento, bairro, cidade, uf) 
                VALUES (?,?,?,?,?,?,?,?)
            `;

            const valuesEnd = [
                rowsCli.insertId,
                endereco.cep,
                endereco.logradouro,
                endereco.numero,
                endereco.complemento,
                endereco.bairro,
                endereco.cidade,
                endereco.uf
            ];

            await conn.execute(sqlEnd, valuesEnd);

            await conn.commit();

            return { id: rowsCli.insertId };

        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    editar: async (cliente) => {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();

            const sql = 'UPDATE clientes SET Nome=?, Cpf=? WHERE Id=?';
            const values = [cliente.nome, cliente.cpf, cliente.id];

            const [result] = await conn.execute(sql, values);

            await conn.commit();
            return result;

        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    deletar: async (id) => {
        const conn = await connection.getConnection();
        try {
            await conn.beginTransaction();

            await conn.execute('DELETE FROM telefones WHERE idCliente = ?', [id]);

            await conn.execute('DELETE FROM enderecos WHERE idCliente = ?', [id]);

            const [result] = await conn.execute('DELETE FROM clientes WHERE Id = ?', [id]);

            await conn.commit();
            return result;

        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    selecionar: async () => {
        const sql = `SELECT clientes.*, telefones.*, enderecos.* 
        FROM clientes
        INNER JOIN telefones ON clientes.id = telefones.idCliente
        INNER JOIN enderecos ON clientes.id = enderecos.idCliente `;
        const [rows] = await connection.execute(sql);
        return rows;
    }

};

export default clienteRepository;