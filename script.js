const $cadastrarCliente = document.querySelector("#cadastrar-cliente");
const $modal = document.querySelector("#modal");
const $modalClose = document.querySelector("#modal-close");
const $saveBtn = document.querySelector("#save-btn");
const $cancelBtn = document.querySelector("#cancel-btn");
const $modalForm = document.querySelector("#modal-form");
const $clientName = document.querySelector("#client-name");
const $clientEmail = document.querySelector("#client-email");
const $clientCel = document.querySelector("#client-cel");
const $clientCity = document.querySelector("#client-city");

//Abertura da caixa para inserir dados do novo cliente ou para editar um existente
const openModal = () => {
  $modal.classList.add("active");//adiciona dinamicamente a class configurada no CSS para a caixa de inserção de dados
};

//Fecha a caixa de inserção removendo a class
const closeModal = () => {
  clearFields();
  $modal.classList.remove("active");
};

//Acesso o banco de dados(localstorage)
const getClient = () => JSON.parse(localStorage.getItem("db_client")) ?? [];

//Envio dados ao bando de dados
const setClient = (dbClient) =>
  localStorage.setItem("db_client", JSON.stringify(dbClient));

//CRUD - Create Read Update Delete

//Foi deixado sem vinculo direto com layout para possivel reutilização dos blocos de codigo

//Create
const createClient = (client) => {
  const dbClient = getClient();
  dbClient.push(client);
  setClient(dbClient);
};

//Read
const readClient = () => getClient();

//Update
const updateClient = (client, index) => {
  const dbClient = getClient();
  dbClient[index] = client;
  setClient(dbClient);
};

//Delete
const deleteClient = (index) => {
  const dbClient = getClient();
  dbClient.splice(index, 1);
  setClient(dbClient);
};

//Funções de validação dos campos
const isValidFields = () => {
  return $modalForm.reportValidity(); //valida se as regras do HTML foram compridas
};

//Funções de limpeza dos campos
const clearFields = () => {
  const fields = document.querySelectorAll(".modal-field");
  fields.forEach((field) => (field.value = ""));
};

//Vinculando com o layout

//Coleta os dados inseridos nos campos no formato json e envia os dados como paramentro para o createClient ao clicar no botão salvar
const saveClient = () => {
  if (isValidFields()) {
    const client = {
      nome: $clientName.value,
      email: $clientEmail.value,
      celular: $clientCel.value,
      cidade: $clientCity.value,
    };
    //Valida atraves do data-index inserido no input clientName para criar ou editar dados
    const index = $clientName.dataset.index;
    if (index == "new") {
      createClient(client);
      updateTable();
      closeModal();
    } else {
      updateClient(client, index);
      updateTable();
      closeModal();
    }
  }
};

//Cria a linha no html seguindo o layout desejado
const createRow = (client, index) => {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>${client.nome}</td>
    <td>${client.email}</td>
    <td>${client.celular}</td>
    <td>${client.cidade}</td>
    <td>
      <button type="button" class="button green" id="edit-${index}">Editar</button>
      <button type="button" class="button red" id="delete-${index}">Excluir</button>
    </td>
  `;
  const $tbody = document.querySelector("#table-client>tbody");
  $tbody.appendChild(newRow);
};

//Limpa a tabela para evitar duplicatas quando o updateTable é acionado, removendo o elemento filho(row) do pai(tbody)
const clearTable = () => {
  const rows = document.querySelectorAll("#table-client>tbody tr");
  rows.forEach((row) => row.parentNode.removeChild(row));
};

//Atualiza a tabela que será apresentada na tela(HTML)
const updateTable = () => {
  const dbClient = readClient();
  clearTable();
  dbClient.forEach(createRow);
};
//Remove o cliente ao clicar no botão Excluir chamando a função do crud delete
const removeClient = (e) => {
  const el = e.target;
  console.log(el);
  deleteClient(el);
};
//Preenche os campos do modal quando clicar no botão editar do usuario
const fillFields = (client) => {
  $clientName.value = client.nome;
  $clientEmail.value = client.email;
  $clientCel.value = client.celular;
  $clientCity.value = client.cidade;
  $clientName.dataset.index = client.index;
};

//Abre o modal para edição dos dados usando o index como localizador pelo id edit-${index}
const editClient = (index) => {
  const client = readClient()[index];
  client.index = index
  fillFields(client);
  openModal();
};

//Valida e reconhe qual botão foi acionado edit ou delete
const editDeleteBtn = (e) => {
  const button = e.target;
  if (button.type == "button") {
    const [action, index] = button.id.split("-");
    if (action == "edit") {
      editClient(index);
    } else {
      const client = readClient()[index]
      const response = confirm(`Deseja excluir os dados do cliente ${client.nome}?`)
      if(response){
        deleteClient(index)
        updateTable()
      }      
    }
  }
};

updateTable();

//Events
$cadastrarCliente.addEventListener("click", openModal);
$modalClose.addEventListener("click", closeModal);
$saveBtn.addEventListener("click", saveClient);
$cancelBtn.addEventListener("click", closeModal);

document
  .querySelector("#table-client>tbody")
  .addEventListener("click", editDeleteBtn);
