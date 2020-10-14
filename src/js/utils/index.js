
const Utils = (() => {

  const getAppRoot = () => {       
    let appRoot = localStorage.getItem('appRoot');
    if(appRoot === null) {
      appRoot = document.URL.substr(0,document.URL.lastIndexOf('/'));
      localStorage.setItem('appRoot', appRoot)
    } 
    return appRoot;
  }

  const getRequestDigest = () => {
    return localStorage.getItem('reqDig') === null ? '' : localStorage.getItem('reqDig');
  }
  
  return {
    getAppRoot: getAppRoot,
    getRequestDigest: getRequestDigest
  };

})();

export default Utils;