import { ReactNativeToWebEvent, WebApplicationInterface } from '@standardnotes/snjs'

export class MobileWebReceiver {
  constructor(private application: WebApplicationInterface) {
    this.listenForNativeMobileEvents()
  }

  deinit() {
    ;(this.application as unknown) = undefined
    window.removeEventListener('message', this.handleNativeMobileWindowMessage)
    document.removeEventListener('message', this.handleNativeMobileWindowMessage as never)
  }

  listenForNativeMobileEvents() {
    const iOSEventRecipient = window
    const androidEventRecipient = document
    iOSEventRecipient.addEventListener('message', this.handleNativeMobileWindowMessage)
    androidEventRecipient.addEventListener('message', this.handleNativeMobileWindowMessage as never)
  }

  handleNativeMobileWindowMessage = (event: MessageEvent) => {
    const nullOrigin = event.origin === '' || event.origin == null
    if (!nullOrigin) {
      return
    }

    const message = (event as MessageEvent).data

    try {
      const parsed = JSON.parse(message)
      const { messageType, reactNativeEvent } = parsed

      if (messageType === 'event' && reactNativeEvent) {
        const nativeEvent = reactNativeEvent as ReactNativeToWebEvent
        this.handleNativeEvent(nativeEvent)
      }
    } catch (error) {
      console.log('Error parsing message from React Native', error)
    }
  }

  handleNativeEvent(event: ReactNativeToWebEvent) {
    switch (event) {
      case ReactNativeToWebEvent.EnteringBackground:
        void this.application.handleMobileEnteringBackgroundEvent()
        break
      case ReactNativeToWebEvent.GainingFocus:
        void this.application.handleMobileGainingFocusEvent()
        break
      case ReactNativeToWebEvent.LosingFocus:
        void this.application.handleMobileLosingFocusEvent()
        break
      case ReactNativeToWebEvent.ResumingFromBackground:
        void this.application.handleMobileResumingFromBackgroundEvent()
        break
      case ReactNativeToWebEvent.AndroidBackButtonPressed:
        void this.application.handleAndroidBackButtonPressed()
        break

      default:
        break
    }
  }
}
