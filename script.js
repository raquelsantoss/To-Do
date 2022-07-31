const listaContainer = document.querySelector('[dados-lista]');
const novaListaForm = document.querySelector('[dados-nova-lista-form]');
const novaListaInput = document.querySelector('[dados-nova-lista-input]');
const deletarListaBotao = document.querySelector('[botao-deletar-dados-lista]');
const listaDisplay = document.querySelector('[lista-display-container]');
const listaTitulo = document.querySelector('[lista-titulo]');
const listaContador = document.querySelector('[lista-contador]');
const tarefasContainer = document.querySelector('[lista-tarefas]');
const tarefasTemplate = document.getElementById('tarefa-template');
const novaTarefaForm = document.querySelector('[dados-nova-tarefa-form]');
const novaTarefaInput = document.querySelector('[dados-nova-tarefa-input]');
const limparTarefasCompletadas = document.querySelector('[limpar-tarefas-completadas]');

const LOCAL_STORAGE_LISTA_KEY = 'tarefa.listas';
const LOCAL_STORAGE_LISTA_SELECIONADA_ID_KEY = 'tarefa.listaSelecionadaId';
let listas = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LISTA_KEY)) || [];
let listaSelecionadaId = localStorage.getItem(LOCAL_STORAGE_LISTA_SELECIONADA_ID_KEY);

listaContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'li') {
    listaSelecionadaId = e.target.dataset.listaId
    salvarRenderizar();
  }
})

tarefasContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'input') {
    const listaSelecionada = listas.find(lista => lista.id === listaSelecionadaId);
    const tarefaSelecionada = listaSelecionada.tarefas.find(tarefa => tarefa.id === e.target.id);
    tarefaSelecionada.complete = e.target.checked
    salvar();
    renderizarContadorTarefa(listaSelecionada);
  }
})

limparTarefasCompletadas.addEventListener('click', e => {
  const listaSelecionada = listas.find(lista => lista.id === listaSelecionadaId);
  listaSelecionada.tarefas = listaSelecionada.tarefas.filter(tarefa => !tarefa.complete)
  salvarRenderizar();
})

deletarListaBotao.addEventListener('click', e => {
  listas = listas.filter(lista => lista.id !== listaSelecionadaId);
  listaSelecionadaId = null;
  salvarRenderizar();
})

novaListaForm.addEventListener('submit', e => {
  e.preventDefault()
  const nomeLista = novaListaInput.value;
  if (nomeLista == null || nomeLista === '') return
  const lista = criarLista(nomeLista);
  novaListaInput.value = null;
  listas.push(lista);
  salvarRenderizar();
})

novaTarefaForm.addEventListener('submit', e => {
  e.preventDefault()
  const nomeTarefa = novaTarefaInput.value;
  if (nomeTarefa == null || nomeTarefa === '') return
  const tarefa = criarTarefa(nomeTarefa);
  novaTarefaInput.value = null;
  const listaSelecionada = listas.find(lista => lista.id === listaSelecionadaId);
  listaSelecionada.tarefas.push(tarefa);
  salvarRenderizar();
})

function criarLista(name) {
  return { id: Date.now().toString(), name: name, tarefas: [] }
}

function criarTarefa(name) {
  return { id: Date.now().toString(), name: name, complete: false }
}

function salvarRenderizar() {
  salvar();
  renderizar();
}

function salvar() {
  localStorage.setItem(LOCAL_STORAGE_LISTA_KEY, JSON.stringify(listas))
  localStorage.setItem(LOCAL_STORAGE_LISTA_SELECIONADA_ID_KEY, listaSelecionadaId)
}

function renderizar() {
  deletarElemento(listaContainer)
  renderizarListas();

  const listaSelecionada = listas.find(lista => lista.id === listaSelecionadaId)
  if (listaSelecionadaId == null) {
    listaDisplay.style.display = 'none'
  } else {
    listaDisplay.style.display = ''
    listaTitulo.innerText = listaSelecionada.name
    renderizarContadorTarefa(listaSelecionada);
    deletarElemento(tarefasContainer);
    renderizarTarefas(listaSelecionada);
  }
}

function renderizarTarefas(listaSelecionada) {
  listaSelecionada.tarefas.forEach(tarefa => {
    const tarefaElement = document.importNode(tarefasTemplate.content, true);
    const checkbox = tarefaElement.querySelector('input');
    checkbox.id = tarefa.id;
    checkbox.checked = tarefa.complete;
    const label = tarefaElement.querySelector('label');
    label.htmlFor = tarefa.id;
    label.append(tarefa.name);
    tarefasContainer.appendChild(tarefaElement);
  })
}

function renderizarContadorTarefa(listaSelecionada) {
  const tarefaIncompletaContador = listaSelecionada.tarefas.filter(tarefa => !tarefa.complete).length
  const tarefaString = tarefaIncompletaContador === 1 ? "tarefa incompleta" : "tarefas incompletas"
  listaContador.innerText = `${tarefaIncompletaContador} ${tarefaString}`
}

function renderizarListas() {
  listas.forEach(lista => {
    const listaElement = document.createElement('li');
    listaElement.dataset.listaId = lista.id;
    listaElement.classList.add("nome-lista");
    listaElement.innerText = lista.name;
    if (lista.id === listaSelecionadaId) {
      listaElement.classList.add('active-list');
    }
    listaContainer.appendChild(listaElement);
  })
}

function deletarElemento(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
renderizar();