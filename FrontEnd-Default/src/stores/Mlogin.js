import { UserAgentApplication } from 'msal'

var msalConfig = {
  auth: {
    clientId: '444047af-5673-4101-99ff-01fa1a5951be',
    authority:
      'https://login.microsoftonline.com/79845616-9df0-43e0-8842-e300feb2642a',
    redirectURI: ' http://localhost:5173/'
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true
  }
}

var requestObj = {
  scopes: ['user.read']
}

var myMSALObj = new UserAgentApplication(msalConfig)

var login = async () => {
  var authResult = await myMSALObj.loginPopup(requestObj)
  return authResult.account
}

var getAccount = async () => {
  var account = await myMSALObj.getAccount()
  return account
}

var logoff = () => {
  myMSALObj.logout()
}

export default {
  login,
  getAccount,
  logoff
}
