import axios from 'axios';
import Utils from '../utils';

const appRoot = Utils.getAppRoot();
const reqDig = Utils.getRequestDigest();
let URL = '';

console.log('appRoot ...', appRoot);
console.log('reqDig ...', reqDig);

if(appRoot.indexOf('localhost') > -1){
  URL = appRoot + '/data/crops.json';
} else if( appRoot.indexOf('sharepoint')) {
  // DEV URL = "https://usdagcc.sharepoint.com/sites/FBC-UX/_layouts/15/download.aspx?UniqueId=0991a988349441fbbb64a54a43e6f069&e=wSU0Ka"
  URL = "https://usdagcc.sharepoint.com/sites/FBC-UX/_layouts/15/download.aspx?UniqueId=20b4564e4e184872b0ce27af87dadfc3&e=kBEOgQ"
}
//console.log('URL', URL)
/*
const config = {
  headers: {
      "Accept": "application/json;odata=verbose",
      "X-HTTP-Method": "MERGE",
      "If-Match": "*",
      "Content-Type":"application/json;odata=verbose"
  }   
};
//if(reqDig != '') config.headers["X-RequestDigest"] = reqDig
*/
export const service = {

  getCrops( callback ){
    let request = axios.get( URL ); //, config );
    this.requestNext( request, callback, 'getCrops')
  },

  requestNext( req, callback, methodCalled ){
    req.then( response => {
      console.log(methodCalled + ' SERVICE', response);

      if( response.data.errors ) callback( { status: false, errors: response.data.errors } )
      else callback( { status: true, data: response.data } )

    }).catch(error => {
      console.log(' CropsName Service Error - method: ' + methodCalled, error)
    })
  }
  
};
