import { service } from '../service/cropNames';
import Utils from '../utils';

const Store = (() => {

  const keys = {
    userFlow: 'userFlow',
    nextPage: 'nextPage',
    prevPage: 'prevPage',
    primaryContact: 'primaryContact',
    commodity: 'commodity',
    commodityClass: 'commodityClass',
    appType: 'appType',
    appNumber: 'appNumber',
    appStatus: 'appStatus',
    refInfo: 'refInfo',
    crops: 'crops',
    appTypes: 'appTypes'
  };
  
  const getters = {
    getKeys: () => { return keys },
    appRoot: () => { return Utils.getAppRoot() },
    userFlow: () => { return localStorage.getItem('userFlow') },
    nextPage: () => { return localStorage.getItem('nextPage') },
    prevPage: () => { return localStorage.getItem('prevPage') },
    primaryContact: () => { return localStorage.getItem('primaryContact') },
    commodity: () => { return localStorage.getItem('commodity') },
    commodityClass: () => { return localStorage.getItem('commodityClass') },
    appType: () => { return localStorage.getItem('appType') },
    appNumber: () => { return localStorage.getItem('appNumber') },
    appStatus: () => { return localStorage.getItem('appStatus') },
    refInfo: () => { return localStorage.getItem('refInfo') },
    crops: () => { return localStorage.getItem('crops') },
    appTypes: () => { return localStorage.getItem('appTypes') }
  };
  
  const actions = {
    setUserFlow(data){ mutations.USER_FLOW(data) },
    setNextPage(data){ mutations.NEXT_PAGE(data) },
    setPrevPage(data){ mutations.PREV_PAGE(data) },
    setPrimaryContact(data){ mutations.PRIMARY_CONTACT(data) },
    setCommodity(data){ mutations.COMMODITY(data) },
    setCommodityClass(data){ mutations.COMMODITY_CLASS(data) },
    setAppType(data){ mutations.APP_TYPE(data) },
    setAppNumber(data){ mutations.APP_NUMBER(data) },
    setAppStatus(data){ mutations.APP_STATUS(data) },
    setRefInfo(data){ mutations.REF_INFO(data) },
    deleteKey(data){ mutations.DELETE_KEY(data) },
    deleteAllData(){ mutations.DELETE_STORE() },
    enableButton(id){ mutations.ENABLE_BUTTON(id) },
    disableButton(id){ mutations.DISABLE_BUTTON(id) },

    async getCrops(){
      //console.log('getCrops')
      return new Promise( (resolve) => {
        service.getCrops( result => {
          if (result.errors){
             console.log('errors'. result.errors)
          } else {
            console.log('result',result)
            mutations.CROPS(result.data);
          }
          resolve();
        });
      });
    },

    setAppTypes(data){ mutations.APP_TYPES(data) }
    
  };
  
  const mutations = {
    USER_FLOW(data){ localStorage.setItem('userFlow', data) },
    NEXT_PAGE(data){ localStorage.setItem('nextPage', data) },
    PREV_PAGE(data){ localStorage.setItem('prevPage', data) },
    PRIMARY_CONTACT(data){ localStorage.setItem('primaryContact', data) },
    COMMODITY(data){ localStorage.setItem('commodity', data) },
    COMMODITY_CLASS(data){ localStorage.setItem('commodityClass', data) },
    APP_TYPE(data){ localStorage.setItem('appType', data) },
    APP_NUMBER(data){ localStorage.setItem('appNumber', data) },
    APP_STATUS(data){ localStorage.setItem('appStatus', data) },
    REF_INFO(data){ localStorage.setItem('refInfo', data) },
    DELETE_KEY(key){
      localStorage.removeItem(key);
      delete keys[key];
    },
    DELETE_STORE(){
      for (let key in keys) {
        localStorage.removeItem(key);
      }
    },
    ENABLE_BUTTON(id){
      document.getElementById(id).removeAttribute('disabled')
    },
    DISABLE_BUTTON(id){
      document.getElementById(id).setAttribute('disabled', 'disabled')
    },
    CROPS(data){
      localStorage.setItem('crops', JSON.stringify(data))
    },
    APP_TYPES(data){
      localStorage.setItem('appTypes', JSON.stringify(data))
    }
  }

  return {
    getters: getters,
    actions: actions,
  };

})();

export default Store;
