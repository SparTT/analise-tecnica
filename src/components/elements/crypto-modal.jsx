import React, { useEffect } from "react";
import Row from "./forms/Row";

export default function Modal({ showModal, setShowModal, isAdd, modalValues, userId, updateData }) {

	/*
	
	      <button
        className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Open regular modal
      </button>
	
	
	*/

	const title = isAdd ? 'Add Crypto' : 'Edit Crypto'
	//const method = isAdd ? '/api/user/add-crypto' : '/api/user/update-data'

	// botar funçao de add e delete p/ funfar

	
 	const handleSubmit = async function (event) {
		
		event.preventDefault()

		let data = {
			name: event.target.name.value,
			amountSpent: event.target['amount-spent'].value,
			cryptoAmount: event.target['crypto-amount'].value,
			userId: userId ? userId : ''
		}

		console.log(data)

		const url = document.querySelector('form').getAttribute('action')
		const method = document.querySelector('form').getAttribute('method')

		let res = await fetch(url, {
			method: method,
			headers: {
        'Content-Type': 'application/json',
      },
			body: JSON.stringify(data)
		}).then(resp => resp.json())
		.then(resp => {
			console.log(resp)
			if (resp.error) return alert(resp.error)
		
			updateData(resp)

			return resp
		})

		//console.log(res)
		return res

 	}
  
  return (
    <>

      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
						id="modal"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl bg-zinc-800 px-6 py-4 rounded-md">
              {/*content*/}
							<form method={isAdd ? 'POST' : 'PUT'} action='/api/user/crypto' onSubmit={handleSubmit}>
								<h1 className="text-xl font-bold text-center my-3">{title}</h1>
								<Row name={'name'} labelText={'Name'} placeholder={'Ex: bitcoin'} 
								required={true} value={modalValues ? modalValues.id : ''}
								disabled={modalValues ? true : false}
								/>
								<Row name={'amount-spent'} labelText={'Amount spent'} placeholder={'500'}
								required={true} value={modalValues ? modalValues.user_spent_amount : 0}
								/>
								<Row name={'crypto-amount'} labelText={'Crypto amount'} placeholder={'2.5'}
								required={true} value={modalValues ? modalValues.user_crypto_qtd : 0}
								/>
								<div className="row">
									<button
										className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none 
										focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
											type="button"
											onClick={() => setShowModal(false)}
										>
											Close
										</button>
										<button
											className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow 
											hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
											id="submit"
										>
											Save Changes
										</button>
									</div>
								</form>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}