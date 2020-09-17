
const Store = (() => {
  

  let keys = {
    nextPage: 'nextPage',
    prevPage: 'prevPage',
    commodity: 'commodity',
    commodityClass: 'commodityClass',
  };
  
  const getters = {
    nextPage: () => { return localStorage.getItem('nextPage') },
    prevPage: () => { return localStorage.getItem('prevPage') },
    commodity: () => { return localStorage.getItem('commodity') },
    commodityClass: () => { return localStorage.getItem('commodityClass') }
  };
  
  const actions = {
    setNextPage(data){
      mutations.NEXT_PAGE(data)
    },

    setPrevPage(data){
      mutations.PREV_PAGE(data)
    },

    setCommodity(data){
      mutations.COMMODITY(data);
    },

    setCommodityClass(data){
      mutations.COMMODITY_CLASS(data);
    },

    deleteAllData(){
      mutations.DELETE_STORE();
    }
    
  };
  
  const mutations = {
    NEXT_PAGE(data){ localStorage.setItem('nextPage', data) },
    
    PREV_PAGE(data){ localStorage.setItem('prevPage', data) },
    
    COMMODITY(data){ localStorage.setItem('commodity', data) },
    
    COMMODITY_CLASS(data){ localStorage.setItem('commodityClass', data) },
    
    DELETE_KEY(key){
      localStorage.removeItem(key);
      delete keys[key];
    },

    DELETE_STORE(){
      for (let key in keys) {
        console.log('LS',localStorage.getItem(key))
        localStorage.removeItem(key);
      }
    }
  }

  return {
    getters: getters,
    actions: actions
  };

})();

export default Store;
