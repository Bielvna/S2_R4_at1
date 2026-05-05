import { Cliente } from "../models/Cliente.js";
import clienteRepository from "../repositories/clienteRepository.js";
import axios from "axios";

const clienteController = {

    criar: async (req, res) => {
        try {
            const { nome, cpf, telefone, cep, numero, complemento } = req.body;

            const cepLimpo = cep ? cep.replace(/\D/g, '') : '';

            const cepRegex = /^[0-9]{8}$/;
            if (!cepRegex.test(cepLimpo)) {
                return res.status(400).json({ message: 'Verifique o CEP informado' });
            }

            const respApi = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);

            if (respApi.data.erro) {
                return res.status(400).json({ message: 'CEP não encontrado' });
            }

            const cliente = Cliente.criar({
                nome,
                cpf
            });

            if (!telefone) {
                return res.status(400).json({ message: 'Telefone não informado' });
            }

            const telefoneObj = {
                numero: telefone
            };

            const enderecoObj = {
                cep: cepLimpo,
                logradouro: respApi.data.logradouro,
                numero: numero,
                complemento: complemento,
                bairro: respApi.data.bairro,
                cidade: respApi.data.localidade,
                uf: respApi.data.uf
            };

            const result = await clienteRepository.criar(cliente, telefoneObj, enderecoObj);

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
            const { nome, cpf } = req.body;

            const cliente = Cliente.alterar({ nome, cpf }, id);

            const result = await clienteRepository.editar(cliente);

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

            const result = await clienteRepository.deletar(id);

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
            const result = await clienteRepository.selecionar();

            res.status(200).json({ result });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Ocorreu um erro no servidor',
                errorMessage: error.message
            });
        }
    }

};

export default clienteController;