 
function setModalHeight() {
  document.querySelector('#demo-modal').style.top = `calc(0% + ${window.scrollY}px)`
}

async function openModal(type, setIsAdd, data, name) {

  console.log('name', name)

  if(type === 'add') {
    await setIsAdd(true)
  } else {
    
    await setIsAdd(false)
    
    document.querySelector('#crypto-name').value = name
    document.querySelector('#crypto-amount').value = data.qtd
    document.querySelector('#amount-spent').value = data.total_spent
  }

  let modal = document.querySelector('#demo-modal')

  modal.style.top = `calc(0% + ${window.scrollY}px)`

  //modal.style.setProperty('top', 'calc(0% + window.scrollY)');
  window.addEventListener('resize', setModalHeight) 

  document.querySelector('.modal-body').style.display = 'block'
  
  document.body.style.overflow = 'hidden'
  modal.setAttribute('open', 'true')
  
  document.addEventListener('keydown', escClose)
  document.querySelector('.modal').addEventListener('click', clickOutOfModal)
  document.querySelector('#modal-overlay').style.display = 'block'

}


function closeModal() {

  let modal = document.querySelector('#demo-modal')

  document.querySelector('.modal-body').style.display = 'none'
  document.body.style.overflow = 'auto'
  modal.removeAttribute('open')

  window.removeEventListener('resize', setModalHeight) 

  document.removeEventListener('keydown', escClose)
  document.querySelector('.modal').removeEventListener('click', clickOutOfModal)
  document.querySelector('#modal-overlay').style.display = 'none'
}

const escClose = (e) => {
  if (e.keyCode === 27) {
    closeModal();
  }
}

const clickOutOfModal = (e) => {
    
  console.log(e.target.className)
  if(e.target.className === 'modal') {
    closeModal()
  }
}