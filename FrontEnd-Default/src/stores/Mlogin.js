import { PublicClientApplication } from '@azure/msal-browser'

const msalConfig = {
  auth: {
    clientId: '444047af-5673-4101-99ff-01fa1a5951be', // Replace with your client ID
    authority:
      'https://login.microsoftonline.com/79845616-9df0-43e0-8842-e300feb2642a', // Replace with your tenant ID
    redirectUri: 'http://localhost:5173' // Replace with your redirect URI
  },
  cache: {
    cacheLocation: 'localStorage', // Options: "localStorage", "sessionStorage"
    storeAuthStateInCookie: false // Recommended for IE11 or Edge
  }
}

const msalInstance = new PublicClientApplication(msalConfig)

export default msalInstance
