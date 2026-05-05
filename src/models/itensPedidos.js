export class ItensPedido {
    #id;
    #pedidoId;
    #produtoId;
    #quantidade;
    #valorItem;

    constructor(produtoId, quantidade, valorItem, id = null, pedidoId = null) {
        this.produtoId = produtoId;
        this.quantidade = quantidade;
        this.valorItem = valorItem;
        this.id = id;
        this.pedidoId = pedidoId;
    }

    get id() { return this.#id; }
    get pedidoId() { return this.#pedidoId; }
    get produtoId() { return this.#produtoId; }
    get quantidade() { return this.#quantidade; }
    get valorItem() { return this.#valorItem; }

    set id(value) {
        if (value !== null) {
            this.#validarId(value);
        }
        this.#id = value;
    }

    set pedidoId(value) {
        if (value !== null) {
            this.#validarPedidoId(value);
        }
        this.#pedidoId = value;
    }

    set produtoId(value) {
        this.#validarProdutoId(value);
        this.#produtoId = value;
    }

    set quantidade(value) {
        const qtd = Number(value);
        this.#validarQuantidade(qtd);
        this.#quantidade = qtd;
    }

    set valorItem(value) {
        const valor = Number(value);
        this.#validarValorItem(valor);
        this.#valorItem = valor;
    }

    #validarId(value) {
        if (value <= 0) {
            throw new Error("Id inválido");
        }
    }

    #validarPedidoId(value) {
        if (!value || value <= 0) {
            throw new Error("Pedido inválido");
        }
    }

    #validarProdutoId(value) {
        if (!value || value <= 0) {
            throw new Error("Produto inválido");
        }
    }

    #validarQuantidade(value) {
        if (isNaN(value) || value <= 0) {
            throw new Error("Quantidade inválida");
        }
    }

    #validarValorItem(value) {
        if (isNaN(value) || value <= 0) {
            throw new Error("Valor do item inválido");
        }
    }

    static calcularSubTotalItens(itens) {
        if (!Array.isArray(itens) || itens.length === 0) {
            return 0;
        }

        return itens.reduce(
            (total, item) => total + (item.valorItem * item.quantidade),
            0
        );
    }

    static criar(dados) {
        return new ItensPedido(
            dados.produtoId,
            dados.quantidade,
            dados.valorItem
        );
    }

    static editar(dados, id, pedidoId) {
        return new ItensPedido(
            dados.produtoId,
            dados.quantidade,
            dados.valorItem,
            id,
            pedidoId
        );
    }
}