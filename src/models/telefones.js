export class Telefone {
    #id;
    #telefone;
    #idCliente;

    constructor(pTelefone, pIdCliente, pId) {
        this.telefone = pTelefone;
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

    get telefone() {
        return this.#telefone;
    }
    set telefone(value) {
        this.#validarTelefone(value);
        this.#telefone = value;
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
            throw new Error('ID inválido');
        }
    }

    #validarTelefone(value) {
        const regex = /^[0-9]{10,11}$/;
        if (!regex.test(value)) {
            throw new Error('Telefone inválido (10 ou 11 números)');
        }
    }

    #validarIdCliente(value) {
        if (!value || value <= 0) {
            throw new Error('ID do cliente inválido');
        }
    }

    static criar(dados) {
        return new Telefone(dados.telefone, dados.idCliente, null);
    }

    static alterar(dados, id) {
        return new Telefone(dados.telefone, dados.idCliente, id);
    }
}