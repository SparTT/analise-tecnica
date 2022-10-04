import Script from 'next/script'
import React, { useState, useEffect } from 'react';

const UpdateCrypto = ({ updateUserData }) => {
  return(
    <div className='modal-body' id="change-crypto">
      <div className='input-container'>
      <label htmlFor='crypto-name'>Nome</label>
        <input id='crypto-name' disabled />
      </div>
      <div className='input-container'>
        <label htmlFor='crypto-amount'>Quantidade de cripto</label>
        <input id='crypto-amount' className='modal-input' defaultValue={0.1} />
      </div>
      <div className='input-container'>
        <label htmlFor='amount-spent'>Quantidade de dinheiro investida</label>
        <input id='amount-spent' className='modal-input' min='0.01' step='0.01' defaultValue={0.1} />
      </div>
      <div className='btn-container'>
        <button className='delete-crypto' onClick={() => deleteCrypto(updateUserData)} data-id='demo-modal' >Deletar</button>
      </div>
    
      <div className='btn-container last'>
          <button className='modal-cancel' onClick={() => closeModal()} data-id='demo-modal' aria-label='Close'>Cancelar</button>
          <button className='modal-confirm' onClick={() => sendUpdate(updateUserData)}>Confirm</button>
      </div>
    </div>
  )
}

const AddCrypto = ({ updateUserData }) => {
  return(
    <div className='modal-body' id="add-crypto">
      <div className='input-container'>
        <label htmlFor='crypto-name'>Nome</label>
        <input id='crypto-name' />
      </div>
      <div className='input-container'>
        <label htmlFor='crypto-amount'>Quantidade de cripto</label>
        <input id='crypto-amount' className='modal-input' defaultValue={0.1} />
      </div>
      <div className='input-container'>
        <label htmlFor='amount-spent'>Quantidade de dinheiro investida</label>
        <input id='amount-spent' className='modal-input' min='0.01' step='0.01' defaultValue={0.1} />
      </div>
    
      <div className='btn-container last'>
          <button className='modal-cancel' onClick={() => closeModal()} data-id='demo-modal' aria-label='Close'>Cancelar</button>
          <button className='modal-confirm' onClick={() => addCryptoData(updateUserData)}>Confirm</button>
      </div>
    </div>
  )
}

async function sendUpdate(updateUserData) {

  let data = {
    name: document.querySelector('#crypto-name').value,
    total_spent: Number(document.querySelector('#amount-spent').value),
    qtd: Number(document.querySelector('#crypto-amount').value)
  }

  let div = document.createElement('div')
  div.classList.add('modal-body-loading')
  document.querySelector('#inner-modal').appendChild(div)

  document.querySelector('.modal-body-loading').innerHTML = '<div>Loading</div>'
  document.querySelector('.modal-body').style.display = 'none'

  await fetch('/api/user/update-data', {
    method: 'POST',
    async:false,
    headers: {
      data: JSON.stringify(data)
    }
  }).then(resp => resp.json())
  .then(resp => {
    console.log('resp', resp)
    updateUserData(resp)
    document.querySelector('.modal-body-loading').remove()
    closeModal();
  })
}


async function deleteCrypto(updateUserData) {
  let willDelete = confirm('Deseja deletar essa crypto?')

  if(willDelete === true) {
    sendDelete(updateUserData)
  }

}

async function sendDelete(updateUserData) {
  let data = {
    name: document.querySelector('#crypto-name').value
  }

  console.log('nome', document.querySelector('#crypto-name').value)

  //document.querySelector('.modal-header .title').innerText = 'Editando...'
  document.querySelector('.modal-body').style.display = 'none'

  await fetch('/api/user/delete-crypto', {
    method: 'POST',
    headers: {
      data: JSON.stringify(data)
    }
  }).then(resp => resp.json())
  .then(async resp => {
    console.log('resp', resp)
    await updateUserData(resp)
    if (document.querySelector('.modal-header .title') !== null) {
      document.querySelector('.modal-header .title').innerText = 'Editar'
      closeModal();
    }
    document.body.style.overflow = 'auto'

    // stopLoading()
  })
}

async function addCryptoData(updateUserData) {

  let data = {
    name: document.querySelector('#crypto-name').value,
    total_spent: Number(document.querySelector('#amount-spent').value),
    qtd: Number(document.querySelector('#crypto-amount').value)
  }


  console.log('sendData', data)

  document.querySelector('.modal-header .title').innerText = 'Adicionando...'
  document.querySelector('.modal-body').style.display = 'none'

  await fetch('/api/user/add-crypto', {
    method: 'POST',
    headers: {
      data: JSON.stringify(data)
    }
  }).then(resp => resp.json())
  .then(async resp => {
    console.log('resp', resp)
    if(!resp.error) {
      await updateUserData(resp)
    } else {
      alert(resp.error.msg)
    }
    if (document.querySelector('.modal-header .title') !== null) {
      document.querySelector('.modal-header .title').innerText = 'Adicionar'
      closeModal();
    }
    document.body.style.overflow = 'auto'
  })
}


export default ({ updateUserData, isAdd }) => {

  return(
    <>
      <div id="demo-modal" className="modal" role="dialog" tabIndex="-1">
        <div id="inner-modal" className="model-inner">
          <div className="modal-header">
            <h2 className='title'>{isAdd === true? 'Adicionar' : 'Editar' }</h2>
          </div>
          {isAdd === true ? <AddCrypto updateUserData={updateUserData} /> : <UpdateCrypto updateUserData={updateUserData} />}
        </div>
      </div>
      <div id="modal-overlay"></div>

      <style> {`

          .modal {
            display: none;
            align-items: center;
            justify-content: center;
            /*position: fixed;*/
            z-index: 1;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0%;
          }
          .modal[open] {
            display: flex;
          }
          .model-inner {
            background-color: white;
            border-radius: 0.5em;
            /*max-width: 450px;*/
            /*width: 100%;*/
            /*min-width: 80%;*/
            padding: 2em;
            margin: auto;
          }
          .modal-header {
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom: 2px solid black;
          }
          #modal-overlay {
            width: 100%;
            height: 100%;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 0;
            background-color: black;
            opacity: 0.5;
            display: none;
          }

          .modal-header .title {
            font-size: 2rem;
          }

          .input-container {
            padding: 1ch;
            display: grid;
            grid-row-gap: 5px; 
          }

          .input-container label {
            font-weight: bold;
            font-size: 1.1rem;
          }
          .input-container input {
            font-size: 0.9rem;
            display: block;
            width: 100%;
            border: 1px solid black;
            padding: 5px;
          }

          .btn-container {
            padding-top: 2ch;
            padding-bottom: 2ch;
            padding-left: 1ch;
            padding-right: 1ch;
          }

          .delete-crypto, .modal-cancel, .modal-confirm {
            color: white;
            padding: 0.375rem;
            border-radius: 0.3rem;
            min-width: 25%;
            font-size: 0.9rem;
            border: 1px solid transparent;
            cursor: pointer;
          }

          .delete-crypto {
            min-width: unset;
          }

          .modal-cancel, .delete-crypto {
            background-color: #dc3545;
            border-color: #dc3545;
          }

          .modal-confirm {
            background-color: #198754;
            border-color: #198754;
          }


          .btn-container.last {
            width: 80%;
            margin-left: auto;
            margin-right: auto;
            grid-template-areas:
                'a b';
            display: flex;
            justify-content: space-between;
            margin-top: 1ch;
          }

          .btn-container.last button {
            width: 45%;
          }

          @media screen and (max-width:799px) {
            .model-inner {
              /*margin-top: 0%;*/
              /*width: 70%;*/
            }
            .modal-header .title {
              font-size: 1.5rem;
            }
          }

        `}
      </style>
      <Script src="/scripts/modal-script.js" />
    </>
  )
}