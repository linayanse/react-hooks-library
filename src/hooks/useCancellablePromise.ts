import { useRef, useEffect } from 'react'

interface ICancelPromise {
  promise: Promise<any>
  cancel(): void
}

export function makeCancelable<P>(promise: Promise<P>) {
  let isCanceled = false

  const wrappedPromise = new Promise<P>((resolve, reject) => {
    promise
      .then(val => {
        if (isCanceled) {
          reject()
        } else {
          resolve(val)
        }
      })
      .catch(error => {
        if (isCanceled) {
          reject()
        } else {
          reject(error)
        }
      })
  })

  return {
    promise: wrappedPromise,
    cancel() {
      isCanceled = true
    },
  }
}

export function useCancellablePromise(cancelable = makeCancelable) {
  const emptyPromise = Promise.resolve(true)

  if (cancelable(emptyPromise).cancel === undefined) {
    throw new Error('promise wrapper argument must provide a cancel() function')
  }

  const promises = useRef<ICancelPromise[]>([])

  useEffect(() => {
    promises.current = promises.current || []

    return () => {
      promises.current.forEach((p: ICancelPromise) => {
        p.cancel()
      })
      promises.current = []
    }
  }, [])

  const cancellablePromise = async <P>(p: Promise<P>): Promise<P> => {
    const cPromise = cancelable(p)

    promises.current.push(cPromise)

    return cPromise.promise
  }

  return { cancellablePromise }
}
