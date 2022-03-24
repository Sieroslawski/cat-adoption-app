import React from 'react'
import { Amplify } from 'aws-amplify';
import { Authenticator, Button } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
import * as amplify from './amplify';
Amplify.configure(awsExports);

function Login() {
  return (
      <Authenticator className="auth-wrapper">
      {({ signOut, user }) => (
        <main className="welcome-wrapper">
          <h1 className="welcome">Hello {user.username}</h1>
          <Button variation="primary" onClick={signOut}>Sign out</Button>
        </main>
      )}
    </Authenticator>
  )
}

export default Login