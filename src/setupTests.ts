import * as ReactDOM from 'react-dom'
import * as ReactDOMClient from 'react-dom/client'
import '@testing-library/jest-dom'

if (!(ReactDOM as any).render) {
  const { createRoot } = ReactDOMClient
  ;(ReactDOM as any).render = (element: any, container: HTMLElement, callback?: () => void) => {
    // createRoot wants exactly one call per container
    const root = createRoot(container)
    root.render(element)
    if(typeof callback === 'function') {
      callback()
    }
    return root
  }
}
