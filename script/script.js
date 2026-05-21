const cadastroUsuario = [{
    id: 1,
    nome: "Joao Silva",
    email: "joao.silva@example.com",
    senha: "123456"
},
{
    id: 2,
    nome: "Maria Oliveira",
    email: "maria.oliveira@example.com",
    senha: "654321"
}];

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
};

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
                <img src="${item.imagem}" alt="${item.nome}" style="width:50px; height:25px; object-fit:cover; border-radius:4px; margin-right:10px;">
                <span style="font-weight:bold;">${item.nome}</span>
                <span style="font-weight:bold;">R$ ${item.preco.toFixed(2)}</span>
            </div>
        `;
        container.appendChild(div);
    });
    if (totalElement) totalElement.innerText = `R$ ${total.toFixed(2)}`;
};

document.addEventListener('DOMContentLoaded', () => {
    exibirTenis();
    exibirCarrinho();
    atualizarContadorCarrinho();

    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('header-scrolled', window.scrollY > 0);
    });

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            const filteredTenis = estoqueTenis.filter(tenis => 
                tenis.nome.toLowerCase().includes(query) || 
                tenis.descricao.toLowerCase().includes(query)
            );
            exibirTenis(filteredTenis);
            if (filteredTenis.length === 0) {
                const container = document.getElementById('product-grid');
                if (container) container.innerHTML = '<p>Nenhum tênis encontrado.</p>';
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

    document.getElementById('clear-cart-btn')?.addEventListener('click', limparCarrinho);
    document.getElementById('checkout-btn')?.addEventListener('click', finalizarCompra);

    const formCadastro = document.getElementById('cadastro-form');
    let cadastroFinalizado = document.getElementById('cadastro-finalizado');

    if (formCadastro) {
        formCadastro.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!validaCadastro()) return;

            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            
            localStorage.setItem('usuarioLogado', JSON.stringify({ nome, email }));
            
            if (cadastroFinalizado) {
                cadastroFinalizado.style.display = 'block';
                cadastroFinalizado.innerText = `Cadastro realizado com sucesso! Bem-vindo, ${nome}. Redirecionando...`;
            }

            setTimeout(() => {
                window.location.href = 'carrinho.html';
            }, 2000);
        });
    }
});

function limparCarrinho() {
    carrinho = [];
    localStorage.removeItem('carrinho');
    atualizarContadorCarrinho();
    exibirCarrinho();
};

function mostrarModalCadastro() {
    let modal = document.getElementById('modal-cadastro');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-cadastro';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.6); display: flex; align-items: center;
            justify-content: center; z-index: 2000;
        `;

        modal.innerHTML = `
            <div style="background: white; padding: 40px; border-radius: 12px; text-align: center; max-width: 450px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); font-family: sans-serif;">
                <h2 style="margin-top: 0; color: #333;">Faça seu Cadastro</h2>
                <p style="color: #666; line-height: 1.6;">Para finalizar sua compra, por favor, crie uma conta conosco. É rápido e fácil!</p>
                <button id="btn-cadastrar" style="margin-top: 25px; background: #333; color: white; border: none; padding: 12px 30px; border-radius: 6px; cursor: pointer; font-weight: bold;">Cadastrar Agora</button>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('btn-cadastrar').addEventListener('click', () => {
            modal.style.display = 'none';
            window.location.href = 'cadastro.html';
        });
    }
    modal.style.display = 'flex';
}

function mostrarModalSucesso() {
    let modal = document.getElementById('modal-sucesso');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-sucesso';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.6); display: flex; align-items: center;
            justify-content: center; z-index: 2000;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 40px; border-radius: 12px; text-align: center; max-width: 450px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); font-family: sans-serif;">
                <div style="font-size: 50px; color: #4CAF50; margin-bottom: 20px;">✓</div>
                <h2 style="margin-top: 0; color: #333;">Compra Realizada!</h2>
                <p style="color: #666; line-height: 1.6;">Obrigado por escolher a nossa loja. Seu pedido foi processado com sucesso e você receberá uma confirmação em breve.</p>
                <button id="btn-fechar-modal" style="margin-top: 25px; background: #333; color: white; border: none; padding: 12px 30px; border-radius: 6px; cursor: pointer; font-weight: bold;">Continuar Comprando</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('btn-fechar-modal').addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    modal.style.display = 'flex';
};

function finalizarCompra() {
    if (carrinho.length === 0) {
        const container = document.getElementById('cart-items');
        if (container) container.innerHTML = '<p>Seu carrinho está vazio. Adicione itens para finalizar a compra.</p>';
        return;
    }

    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (!usuarioLogado) {
        mostrarModalCadastro();
        return;
    }

    carrinho = [];
    localStorage.removeItem('carrinho');
    atualizarContadorCarrinho();
    exibirCarrinho();
    mostrarModalSucesso();
};

function validaCadastro() {
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();

    if (!nome || !email || !senha) {
        alert('Por favor, preencha todos os campos.');
        return false;
    }
    return true;
}