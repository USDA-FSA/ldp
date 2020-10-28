import axios from 'axios';
import Utils from '../utils';

const appRoot = Utils.getAppRoot();
const reqDig = Utils.getRequestDigest();
let URL = '';

console.log('appRoot ...', appRoot);
console.log('reqDig ...', reqDig);

if(appRoot.indexOf('localhost') > -1){
  URL = appRoot + '/data/crops.json.txt';
} else if( appRoot.indexOf('sharepoint')) {
  //URL = "https://usdagcc.sharepoint.com/sites/FBC-UX/_layouts/15/download.aspx?UniqueId=2d4753ff785b4174a4ac4b31f2caa0f8&e=YcK0XQ"
  URL = 'https://usdagcc.sharepoint.com/sites/FBC-UX/XCut/8-Projects/LDP/DEV/data/crops.json.txt';
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
