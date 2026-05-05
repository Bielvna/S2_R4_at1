export class Cliente {
    #id;
    #nome;
    #cpf;
    #dataCad;

    constructor(pNome, pCpf, pId) {
        this.nome = pNome;
        this.cpf = pCpf;
        this.id = pId;
        this.#dataCad = new Date();
    }

    get id() { return this.#id; }
    set id(value) {
        this.#validarId(value);
        this.#id = value;
    }

    get nome() { return this.#nome; }
    set nome(value) {
        this.#validarNome(value);
        this.#nome = value;
    }

    get cpf() { return this.#cpf; }
    set cpf(value) {
        this.#validarCpf(value);
        this.#cpf = value;
    }

    get dataCad() { return this.#dataCad; }

    #validarId(value) {
        if (value && value <= 0) {
            throw new Error('ID inválido');
        }
    }

    #validarNome(value) {
        if (!value || value.trim().length < 3) {
            throw new Error('Nome inválido');
        }
    }

    #validarCpf(value) {
        const regex = /^[0-9]{11}$/;
        if (!regex.test(value)) {
            throw new Error('CPF inválido');
        }
    }

    static criar(dados) {
        return new Cliente(dados.nome, dados.cpf, null);
    }

    static alterar(dados, id) {
        return new Cliente(dados.nome, dados.cpf, id);
    }
}