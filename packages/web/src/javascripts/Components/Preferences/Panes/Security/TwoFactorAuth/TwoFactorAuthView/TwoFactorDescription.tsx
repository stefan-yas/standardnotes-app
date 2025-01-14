import { FunctionComponent } from 'react'
import { Text } from '@/Components/Preferences/PreferencesComponents/Content'
import { observer } from 'mobx-react-lite'
import { TwoFactorAuth } from '../TwoFactorAuth'

type Props = {
  auth: TwoFactorAuth
}

const TwoFactorDescription: FunctionComponent<Props> = ({ auth }) => {
  if (!auth.isLoggedIn()) {
    return <Text>Sign in or register for an account to configure 2FA.</Text>
  }
  if (!auth.isMfaFeatureAvailable()) {
    return (
      <Text>
        A paid subscription plan is required to enable 2FA.{' '}
        <a target="_blank" href="https://standardnotes.com/features">
          Learn more
        </a>
        .
      </Text>
    )
  }
  return <Text>An extra layer of security when logging in to your account.</Text>
}

export default observer(TwoFactorDescription)
