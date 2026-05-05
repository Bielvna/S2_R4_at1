export class Produto{
    #id;
    #idCategoria;
    #nome;
    #valor;
    #dataCad;
    #caminhoImg

    constructor(pNome, pValor, pCaminhoImg, pIdCategoria, pId) {
        this.nome = pNome;
        this.valor = pValor;
        this.id = pId;
        this.caminhoImg = pCaminhoImg;
        this.idCategoria = pIdCategoria
    }

    //Métodos acessores - GETTERS e SETTERS
    get id() {
        return this.#id;
    }
    set id(value) {
        this.#validarId(value);
        this.#id = value;
    }
    get nome(){
        return this.#nome;
    }
    set nome(value){
        this.#validarNome(value);
        this.#nome = value;
    }
    get valor(){
        return this.#valor;
    }
    set valor(value){
        this.#validarValor(value);
        this.#valor = value;
    }
    get idCategoria(){
        return this.#idCategoria;
    }
    set idCategoria(value){
        this.#validarIdCategoria(value);
        this.#idCategoria = value;
    }
    get caminhoImg(){
        return this.#caminhoImg;
    }
    set caminhoImg(value){
        this.#validarCaminhoImg(value);
        this.#caminhoImg= value;
    }

    //Métodos auxiliares
    #validarId(value) {
        if (value && value <= 0) {
            throw new Error('Verifique o ID informado');
        }
    }
    #validarNome(value){
        if(!value || value.trim().length < 3 || value.trim().length > 45){
            throw new Error('O campo nome é obrigatório e deve ter entre 3 e 45 caracteres!');
        }
    }
    #validarValor(value){
        if(isNaN(value) || value <= 0){
            throw new Error('O valor digitado é inválido!');
        }
    }
    #validarIdCategoria(value){
        if(!value || value <= 0){
            throw new Error('Id da Categoria inválido!');
        }
    }
    #validarCaminhoImg(value){
        if(!value || value.trim().length < 5){
            throw new Error('Caminho da Imagem inválido!');
        }
    }
  
   

    //Criação de objetos utilizando o Design Pattern Factory Method
    static criar(dados){
        console.log(dados.nome, dados.valor, dados.caminhoImg, dados.idCategoria);
        
        return new Produto(dados.nome, dados.valor, dados.caminhoImg, dados.idCategoria, null);
    }
    static alterar(dados, id){
        return new Produto(dados.nome, dados.valor, dados.caminhoImg, dados.idCategoria, id);
    }
}