import { PublicClientApplication } from '@azure/msal-browser'

const msalConfig = {
  auth: {
    clientId: 'd129054b-4326-426a-a979-999c98603cc6', // Replace with your client ID
    authority:
      'https://login.microsoftonline.com/79845616-9df0-43e0-8842-e300feb2642a', // Replace with your tenant ID
    redirectUri: 'http://localhost:8080/callback/login' // Replace with your redirect URI
  },
  cache: {
    cacheLocation: 'localStorage', // Options: "localStorage", "sessionStorage"
    storeAuthStateInCookie: false // Recommended for IE11 or Edge
  }
}

const msalInstance = new PublicClientApplication(msalConfig)

export default msalInstance
