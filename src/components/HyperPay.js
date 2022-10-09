import React from 'react'

import { useI18n } from '../helpers'

const HyperPay = ({ url, brands, redirectUrl, logo }) => {
  const i18n = useI18n()
  const isBrowser = typeof window !== 'undefined'

  const renderForm = () => {
    const div = document.createElement('div')
    div.setAttribute('id', 'hyperpay')
    document.body.appendChild(div)

    const beforeLoadScript = document.createElement('script')
    beforeLoadScript.innerHTML = 'var wpwlOptions = {style: "plain",paymentTarget:"_top",locale: "' + i18n.locale + '"}'

    const script = document.createElement('script')
    script.src = url
    script.async = true

    const form = document.createElement('form')
    form.action = redirectUrl
    // form.action = 'http://localhost:8000/en/results/'
    form.className = 'paymentWidgets'
    form.setAttribute('async', true)
    form.setAttribute('data-brands', brands)

    const hyperpayDiv = document.getElementById('hyperpay')
    hyperpayDiv.innerHTML = ''
    hyperpayDiv.appendChild(beforeLoadScript)
    hyperpayDiv.appendChild(script)
    hyperpayDiv.appendChild(form)
  }
  const history = isBrowser ? window.location.href : ''
  return (
    <div style={{ direction: 'ltr !important' }}>
      {history.includes('payment') ? <>{renderForm()}</> : <></>}
    </div>
  )
}

export default HyperPay
