export class Pedido {
    #id;
    #clienteId;
    #subTotal;
    #status;
    #dataCad;

    constructor(clienteId, subTotal, status, id = null, dataCad = null) {

        if (clienteId !== null) this.clienteId = clienteId;
        if (subTotal !== null) this.subTotal = subTotal;
        if (status !== null) this.status = status;

        this.id = id;
        this.#dataCad = dataCad ?? new Date();
    }

    get id() { return this.#id; }
    get clienteId() { return this.#clienteId; }
    get subTotal() { return this.#subTotal; }
    get status() { return this.#status; }
    get dataCad() { return this.#dataCad; }

    set id(value) {
        if (value !== null) {
            this.#validarId(value);
        }
        this.#id = value;
    }

    set clienteId(value) {
        this.#validarClienteId(value);
        this.#clienteId = value;
    }

    set subTotal(value) {
        this.#validarSubTotal(value);
        this.#subTotal = value;
    }

    set status(value) {
        this.#validarStatus(value);
        this.#status = value;
    }

    #validarId(value) {
        if (value <= 0) {
            throw new Error("Id inválido");
        }
    }

    #validarClienteId(value) {
        if (!value || value <= 0) {
            throw new Error("Cliente inválido");
        }
    }

    #validarSubTotal(value) {
        if (value < 0) {
            throw new Error("Subtotal inválido");
        }
    }

    #validarStatus(value) {
        const statusValidos = ["Aberto", "Finalizado", "Pendente"];

        if (!value || !statusValidos.includes(value)) {
            throw new Error("Status inválido");
        }
    }

    static criar(dados) {
        return new Pedido(
            dados.clienteId,
            dados.subTotal,
            dados.status
        );
    }

    static alterar(dados, id) {
        return new Pedido(
            null,
            null,
            dados.status,
            id
        );
    }
}