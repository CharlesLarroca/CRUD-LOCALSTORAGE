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

const openModal = () => {
  $modal.classList.add("active");
};

const closeModal = () => {
  clearFields();
  $modal.classList.remove("active");
};

//Acesso ao banco de dados(localstorage)
const getClient = () => JSON.parse(localStorage.getItem("db_client")) ?? [];

//Envio de dados ao bando de dados
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

//Funções de Validação
const isValidFields = () => {
  return $modalForm.reportValidity(); //valida se as regras do HTML foram compridas
};

const clearFields = () => {
  const fields = document.querySelectorAll(".modal-field");
  fields.forEach((field) => (field.value = ""));
};

//Vinculando com o layout

//Salvando os dados coletados no formato json e envia os dados como paramentro para o create
const saveClient = () => {
  if (isValidFields()) {
    const client = {
      nome: $clientName.value,
      email: $clientEmail.value,
      celular: $clientCel.value,
      cidade: $clientCity.value,
    };

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

const clearTable = () => {
  const rows = document.querySelectorAll("#table-client>tbody tr");
  rows.forEach((row) => row.parentNode.removeChild(row));
};

const updateTable = () => {
  const dbClient = readClient();
  clearTable();
  dbClient.forEach(createRow);
};

const removeClient = (e) => {
  const el = e.target;
  console.log(el);
  deleteClient(el);
};

const fillFields = (client) => {
  $clientName.value = client.nome;
  $clientEmail.value = client.email;
  $clientCel.value = client.celular;
  $clientCity.value = client.cidade;
  $clientName.dataset.index = client.index;
};

const editClient = (index) => {
  const client = readClient()[index];
  client.index = index
  fillFields(client);
  openModal();
};

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
