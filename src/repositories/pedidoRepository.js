import {connection} from "../config/Database.js"

const pedidoRepository = {

    criar: async (pedido, itens) => {
        const conn = await connection.getConnection();

        try {
            await conn.beginTransaction();

            const [resultPedido] = await conn.execute(
                `INSERT INTO pedidos (ClienteId, SubTotal, Status)
                 VALUES (?, ?, ?)`,
                [pedido.clienteId, pedido.subTotal, pedido.status]
            );

            const pedidoId = resultPedido.insertId;

            for (const item of itens) {
                await conn.execute(
                    `INSERT INTO Itens_pedidos (PedidoId, ProdutoId, Quantidade, ValorItem)
                     VALUES (?, ?, ?, ?)`,
                    [pedidoId, item.produtoId, item.quantidade, item.valorItem]
                );
            }

            await atualizarSubtotal(conn, pedidoId);

            await conn.commit();
            return { pedidoId };

        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    adicionarItem: async (pedidoId, item) => {
        const conn = await connection.getConnection();

        try {
            await conn.beginTransaction();

            await conn.execute(
                `INSERT INTO Itens_pedidos (PedidoId, ProdutoId, Quantidade, ValorItem)
                 VALUES (?, ?, ?, ?)`,
                [pedidoId, item.produtoId, item.quantidade, item.valorItem]
            );

            await atualizarSubtotal(conn, pedidoId);

            await conn.commit();
            return { message: "Item adicionado com sucesso" };

        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    editarItem: async (itemId, quantidade) => {
        const conn = await connection.getConnection();

        try {
            await conn.beginTransaction();

            const [[item]] = await conn.execute(
                "SELECT PedidoId FROM Itens_pedidos WHERE Id = ?",
                [itemId]
            );

            if (!item) throw new Error("Item não encontrado");

            await conn.execute(
                "UPDATE Itens_pedidos SET Quantidade = ? WHERE Id = ?",
                [quantidade, itemId]
            );

            await atualizarSubtotal(conn, item.PedidoId);

            await conn.commit();
            return { message: "Item atualizado com sucesso" };

        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    removerItem: async (itemId) => {
        const conn = await connection.getConnection();

        try {
            await conn.beginTransaction();

            const [[item]] = await conn.execute(
                "SELECT PedidoId FROM Itens_pedidos WHERE Id = ?",
                [itemId]
            );

            if (!item) throw new Error("Item não encontrado");

            await conn.execute(
                "DELETE FROM Itens_pedidos WHERE Id = ?",
                [itemId]
            );

            await atualizarSubtotal(conn, item.PedidoId);

            await conn.commit();
            return { message: "Item removido com sucesso" };

        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    editar: async (pedido) => {
        const [result] = await connection.execute(
            "UPDATE pedidos SET Status = ? WHERE Id = ?",
            [pedido.status, pedido.id]
        );

        if (result.affectedRows === 0) {
            throw new Error("Pedido não encontrado");
        }

        return { message: "Status atualizado com sucesso" };
    },

    selecionar: async () => {
        const [pedidos] = await connection.execute("SELECT * FROM pedidos");

        for (const pedido of pedidos) {
            const [itens] = await connection.execute(
                "SELECT * FROM Itens_pedidos WHERE PedidoId = ?",
                [pedido.Id]
            );

            pedido.itens = itens;
        }

        return pedidos;
    },

    deletar: async (id) => {
        const conn = await connection.getConnection();

        try {
            await conn.beginTransaction();

            await conn.execute(
                "DELETE FROM Itens_pedidos WHERE PedidoId = ?",
                [id]
            );

            await conn.execute(
                "DELETE FROM pedidos WHERE Id = ?",
                [id]
            );

            await conn.commit();

            return { message: "Pedido deletado com sucesso" };

        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }
};

async function atualizarSubtotal(conn, pedidoId) {
    await conn.execute(`
        UPDATE pedidos 
        SET SubTotal = (
            SELECT IFNULL(SUM(Quantidade * ValorItem), 0)
            FROM Itens_pedidos
            WHERE PedidoId = ?
        )
        WHERE Id = ?
    `, [pedidoId, pedidoId]);
}

export default pedidoRepository;