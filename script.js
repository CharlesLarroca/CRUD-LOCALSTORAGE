const $cadastrarCliente = document.querySelector('#cadastrar-cliente')
const $modal = document.querySelector('#modal')
const $modalClose = document.querySelector('#modal-close')

const openModal = () => {
  $modal.classList.add('active')
}

const closeModal = () => {
  $modal.classList.remove('active')
}

$cadastrarCliente.addEventListener('click', openModal)

$modalClose.addEventListener('click', closeModal)