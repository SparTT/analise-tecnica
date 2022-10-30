import { useSession, signIn, getSession, signOut } from "next-auth/react"
import React, { useState, useEffect } from 'react';
import { SessionProvider } from "next-auth/react"


// criar template de tabela pelo menos p/ desktop aq (dar ctrl c da existente na dashboard)
// criar shimmer genérico
// setar vsCurrency como componente acima de todos -- come se o _app fosse uma pagina Main.js 
// head main footer será adicionado em cada page

// mudar LOADING COMPLETO DA DASHBOARD EHHE

export default (data) => {
  return (
    <>
     <div className={styles.table}>
        <div className={`${styles['table-head']} ${'table-head'}`}>
          <div className='col-1'>Nome</div>
          <div className='col-2'>Qtd</div>
          <div className='col-3'>24h</div>
          <div className='col-4'>Custo</div>
          <div className='col-5'>Preço</div>
          <div className='col-6'>Total</div>
          <div className='col-7'></div>
        </div>
              <div className={styles['table-body']}>
                {data.map( coin => (
                  <div className={`${styles['card']} ${'card'}`} key={coin.id}>
                    <div className='col-1'>
                    </div>
                    <div className='col-2'>
                    </div>
                    <div className='col-3'>
                    </div>  
                    <div className='col-4'>
                    </div>
                    <div className='col-5'>
                    </div>  
                    <div className='col-6'>
                    </div>
                    <div className='col-7'>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <style jsx>{`

              .table-head, .card {
                grid-template-areas:
                    "name qtd 24h cost price total edit";
                width: 100%;
                grid-template-columns: 25% 6% 15% 15% 17% 17% 2%;
              }

              .col-1 {
                grid-area: name;
                margin-left: 10px;
              }

              .col-2, .col-3, .col-4, .col-5, .col-6 {
                text-align: right;
              }

              .col-2 {
                text-align: right;
                grid-area: qtd;
              }

              .col-3 {
                grid-area: 24h;
              }

              .col-4 {
                grid-area: cost;
              }

              .col-5 {
                grid-area: price;
              }

              .col-6 {
                grid-area: total;
                text-align: center;
              }

              .col-7 {
                grid-area: edit;
              }

              /* --- */

              #add-crypto-btn {
                background: #3f51b5;
                color: white;
                border: 1px solid transparent;
                border-radius: 0.375rem;
              }

              .total-amount, .amount-spent, .user-qtd {
                font-weight: bold;
              }

              .amount-spent, .current-price {
                color: #626262;
              }

              .edit-btn {
                background: unset;
                border: unset;
                cursor: pointer;
              }

              .edit-btn img {
                width: 20px;
              }

              .btn-container {
                padding-top: 2ch;
                padding-bottom: 2ch;
              }

              .btn-container button {
                  padding: 1ch;
                  font-size: 1rem;
                  cursor: pointer;
              }

              `}</style>
    </>
  )
}
