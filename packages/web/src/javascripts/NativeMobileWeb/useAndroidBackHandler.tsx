import { WebApplication } from '@/Application/Application'
import { observer } from 'mobx-react-lite'
import { createContext, memo, ReactNode, useCallback, useContext, useEffect } from 'react'

type BackHandlerContextData = WebApplication['addAndroidBackHandlerEventListener']

const BackHandlerContext = createContext<BackHandlerContextData | null>(null)

export const useAndroidBackHandler = () => {
  const value = useContext(BackHandlerContext)

  if (!value) {
    throw new Error('Component must be a child of <AndroidBackHandlerProvider />')
  }

  return value
}

type ChildrenProps = {
  children: ReactNode
}

type ProviderProps = {
  application: WebApplication
} & ChildrenProps

const MemoizedChildren = memo(({ children }: ChildrenProps) => <div>{children}</div>)

const AndroidBackHandlerProvider = ({ application, children }: ProviderProps) => {
  const addAndroidBackHandler = useCallback(
    (listener: () => boolean) => application.addAndroidBackHandlerEventListener(listener),
    [application],
  )

  useEffect(() => {
    const removeListener = addAndroidBackHandler(() => {
      application.mobileDevice().confirmAndExit()
      return true
    })
    return () => {
      if (removeListener) {
        removeListener()
      }
    }
  }, [addAndroidBackHandler, application])

  return (
    <BackHandlerContext.Provider value={addAndroidBackHandler}>
      <MemoizedChildren children={children} />
    </BackHandlerContext.Provider>
  )
}

export default observer(AndroidBackHandlerProvider)
