const estoqueTenis = [{
    id: 1,
    nome: "Tênis Nike Air Max 270",
    descricao: "O Nike Air Max 270 é um tênis de corrida que combina estilo e conforto. Ele apresenta uma unidade Air Max de 270 graus para amortecimento excepcional e um design moderno.",
    preco: 899.99,
    imagem: "https://m.media-amazon.com/images/I/81Uufgl2tNL._AC_SX575_.jpg"
}, 
{
    id: 2,
    nome: "Tênis Adidas Ultraboost 21",
    descricao: "O Adidas Ultraboost 21 é um tênis de corrida de alto desempenho que oferece conforto e suporte excepcionais. Ele apresenta a tecnologia Boost para retorno de energia e uma parte superior Primeknit para ajuste perfeito.",
    preco: 999.99,
    imagem: "https://runningspeed.com.br/app/media/images_product/big/112629245/9a24c2637b.jpg"}, 
{
    id: 3,
    nome: "Tênis Puma RS-X3",
    descricao: "O Puma RS-X3 é um tênis de estilo de vida que combina design moderno com conforto. Ele apresenta uma entressola RS para amortecimento e uma parte superior em malha para respirabilidade.",
    preco: 499.99,
    imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYXOsXCMqug_dafVPomLxWrUp4wbffME_xog&s"
}];

let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

function atualizarContadorCarrinho() {
    const contador = document.getElementById('cart-count');
    if (contador) {
        contador.innerText = carrinho.length;
    }
}

function exibirTenis(lista = estoqueTenis) {
    const container = document.getElementById('product-grid');
    if (!container) return;

    container.innerHTML = '';
    lista.forEach(tenis => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${tenis.imagem}" alt="${tenis.nome}">
            <h3>${tenis.nome}</h3>
            <p>${tenis.descricao}</p>
            <p>R$ ${tenis.preco.toFixed(2)}</p>
            <button class="add-to-cart-btn" data-id="${tenis.id}">Adicionar ao Carrinho</button>
        `;
        container.appendChild(card);
    });
};

function exibirCarrinho() {
    const container = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');
    if (!container) return;

    if (carrinho.length === 0) {
        container.innerHTML = '<p>Seu carrinho está vazio.</p>';
        if (totalElement) totalElement.innerText = 'R$ 0,00';
        return;
    }

    container.innerHTML = '';
    let total = 0;
    carrinho.forEach((item) => {
        total += item.preco;
        const div = document.createElement('div');
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #ddd;">
                <span>${item.nome}</span>
                <span>R$ ${item.preco.toFixed(2)}</span>
            </div>
        `;
        container.appendChild(div);
    });
    if (totalElement) totalElement.innerText = `R$ ${total.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', () => {
    exibirTenis();
    exibirCarrinho();
    atualizarContadorCarrinho();
});

const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
    const filteredTenis = estoqueTenis.filter(tenis => tenis.nome.toLowerCase().includes(query));
    exibirTenis(filteredTenis);
    if (filteredTenis.length === 0) {
        const container = document.getElementById('product-grid');
        container.innerHTML = '<p>Nenhum tênis encontrado.</p>';
    }
    });
}

document.getElementById('product-grid')?.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart-btn')) {
        const id = parseInt(e.target.getAttribute('data-id'));
        const tenis = estoqueTenis.find(t => t.id === id);
        if (tenis) {
            carrinho.push(tenis);
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            atualizarContadorCarrinho();
            exibirCarrinho();
        }
    }
});

function limparCarrinho() {
    carrinho = [];
    localStorage.removeItem('carrinho');
    atualizarContadorCarrinho();
    exibirCarrinho();
}

document.getElementById('clear-cart-btn')?.addEventListener('click', limparCarrinho);