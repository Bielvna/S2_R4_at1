export class Endereco {
    #id;
    #cep;
    #numero;
    #complemento;
    #idCliente;

    constructor(pCep, pNumero, pComplemento, pIdCliente, pId) {
        this.cep = pCep;
        this.numero = pNumero;
        this.complemento = pComplemento;
        this.idCliente = pIdCliente;
        this.id = pId;
    }

    // GETTERS E SETTERS
    get id() {
        return this.#id;
    }
    set id(value) {
        this.#validarId(value);
        this.#id = value;
    }

    get cep() {
        return this.#cep;
    }
    set cep(value) {
        this.#validarCep(value);
        this.#cep = value;
    }

    get numero() {
        return this.#numero;
    }
    set numero(value) {
        this.#validarNumero(value);
        this.#numero = value;
    }

    get complemento() {
        return this.#complemento;
    }
    set complemento(value) {
        this.#complemento = value;
    }

    get idCliente() {
        return this.#idCliente;
    }
    set idCliente(value) {
        this.#validarIdCliente(value);
        this.#idCliente = value;
    }

    #validarId(value) {
        if (value && value <= 0) {
            throw new Error('Verifique o ID informado');
        }
    }

    #validarCep(value) {
        const regex = /^[0-9]{8}$/;
        if (!regex.test(value)) {
            throw new Error('CEP inválido');
        }
    }

    #validarNumero(value) {
        if (!value) {
            throw new Error('Número é obrigatório');
        }
    }

    #validarIdCliente(value) {
        if (!value || value <= 0) {
            throw new Error('ID do cliente inválido');
        }
    }

    static criar(dados) {
        return new Endereco(
            dados.cep,
            dados.numero,
            dados.complemento,
            dados.idCliente,
            null
        );
    }

    static alterar(dados, id) {
        return new Endereco(
            dados.cep,
            dados.numero,
            dados.complemento,
            dados.idCliente,
            id
        );
    }
}