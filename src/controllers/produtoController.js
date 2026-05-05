import { Produto } from "../models/Produto.js";
import produtoRepository from "../repositories/produtoRepository.js";

const produtoController = {

    criar: async (req, res) => {
        try {
            const { idCategoria, nome, valor } = req.body;

        
            if (!nome || !valor || !idCategoria) {
                return res.status(400).json({ message: "Preencha todos os campos" });
            }

    
            const caminhoImg = req.file 
                ? `/uploads/${req.file.filename}` 
                : null;

            const produto = Produto.criar({
                idCategoria,
                nome,
                valor,
                caminhoImg
            });

            const result = await produtoRepository.criar(produto);

            res.status(201).json({ result });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Ocorreu um erro no servidor',
                errorMessage: error.message
            });
        }
    },

    editar: async (req, res) => {
        try {
            const id = req.params.id;
            const { nome, valor, idCategoria } = req.body;

            const caminhoImg = req.file
                ? `/uploads/${req.file.filename}`
                : null;

            const produto = Produto.alterar({
                nome,
                valor,
                idCategoria,
                caminhoImg
            }, id);

            const result = await produtoRepository.editar(produto);

            res.status(200).json({ result });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Ocorreu um erro no servidor',
                errorMessage: error.message
            });
        }
    },

    deletar: async (req, res) => {
        try {
            const id = req.params.id;

            const result = await produtoRepository.deletar(id);

            res.status(200).json({ result });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Ocorreu um erro no servidor',
                errorMessage: error.message
            });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await produtoRepository.selecionar();

            res.status(200).json({ result });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Ocorreu um erro no servidor',
                errorMessage: error.message
            });
        }
    },
};

export default produtoController;