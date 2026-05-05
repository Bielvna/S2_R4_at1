import pedidoRepository from "../repositories/pedidoRepository.js";
import { Pedido } from "../models/pedidos.js";
import { statusPed } from "../enums/statusPedido.js";
import { ItensPedido } from "../models/itensPedidos.js";

const pedidoController = {

    criar: async (req, res) => {
        try {
            const { clienteId, itens } = req.body;

            if (!clienteId) {
                return res.status(400).json({ message: "Cliente não informado" });
            }

            if (!itens || itens.length === 0) {
                return res.status(400).json({ message: "Itens do pedido não informados" });
            }

            const itensPedido = itens.map(item => {
                if (!item.produtoId || !item.quantidade || !item.valorItem) {
                    throw new Error("Itens inválidos");
                }

                return ItensPedido.criar({
                    produtoId: Number(item.produtoId),
                    quantidade: Number(item.quantidade),
                    valorItem: Number(item.valorItem)
                });
            });

            const subTotal = ItensPedido.calcularSubTotalItens(itensPedido);

            const pedido = Pedido.criar({
                clienteId: Number(clienteId),
                subTotal,
                status: statusPed.ABERTO
            });

            const result = await pedidoRepository.criar(pedido, itensPedido);

            return res.status(201).json({
                message: "Pedido criado com sucesso",
                result
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Erro ao criar pedido",
                errorMessage: error.message
            });
        }
    },

    editar: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const { status } = req.body;

            if (!id) {
                return res.status(400).json({ message: "ID inválido" });
            }

            if (!status) {
                return res.status(400).json({ message: "Status não informado" });
            }

            const pedido = Pedido.alterar({ status }, id);

            const result = await pedidoRepository.editar(pedido);

            return res.status(200).json({
                message: "Status do pedido atualizado",
                result
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Erro ao editar pedido",
                errorMessage: error.message
            });
        }
    },

    deletar: async (req, res) => {
        try {
            const id = Number(req.params.id);

            if (!id) {
                return res.status(400).json({ message: "ID inválido" });
            }

            const result = await pedidoRepository.deletar(id);

            return res.status(200).json({
                message: "Pedido deletado com sucesso",
                result
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Erro ao deletar pedido",
                errorMessage: error.message
            });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await pedidoRepository.selecionar();

            return res.status(200).json({
                message: "Pedidos listados com sucesso",
                result
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Erro ao buscar pedidos",
                errorMessage: error.message
            });
        }
    },

    adicionarItem: async (req, res) => {
        try {
            const pedidoId = Number(req.params.pedidoId);
            const { produtoId, quantidade, valorItem } = req.body;

            if (!pedidoId) {
                return res.status(400).json({ message: "Pedido inválido" });
            }

            if (!produtoId || !quantidade || !valorItem) {
                return res.status(400).json({ message: "Dados do item inválidos" });
            }

            const item = ItensPedido.criar({
                produtoId: Number(produtoId),
                quantidade: Number(quantidade),
                valorItem: Number(valorItem)
            });

            await pedidoRepository.adicionarItem(pedidoId, item);

            return res.status(200).json({
                message: "Item adicionado com sucesso"
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Erro ao adicionar item",
                errorMessage: error.message
            });
        }
    },

    editarItem: async (req, res) => {
        try {
            const itemId = Number(req.params.itemId);
            const { quantidade } = req.body;

            if (!itemId) {
                return res.status(400).json({ message: "Item inválido" });
            }

            if (!quantidade || quantidade <= 0) {
                return res.status(400).json({ message: "Quantidade inválida" });
            }

            await pedidoRepository.editarItem(itemId, Number(quantidade));

            return res.status(200).json({
                message: "Item atualizado com sucesso"
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Erro ao editar item",
                errorMessage: error.message
            });
        }
    },

    removerItem: async (req, res) => {
        try {
            const itemId = Number(req.params.itemId);

            if (!itemId) {
                return res.status(400).json({ message: "Item inválido" });
            }

            await pedidoRepository.removerItem(itemId);

            return res.status(200).json({
                message: "Item removido com sucesso"
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Erro ao remover item",
                errorMessage: error.message
            });
        }
    }

};

export default pedidoController;