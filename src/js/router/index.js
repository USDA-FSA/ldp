const Router = (() => {

  let store = {};
  
  const use = function(Store){
    store = Store;
  };

  const to = (page=null) => {
    store.actions.setPrevPage(window.location.href)
    let next = page != null ? page : store.getters.nextPage();
    window.location.href = next;
  };
  
  const back = () => {
    window.history.back();
  }

  return {
    use: use,
    to: to,
    back: back
  };

})();

export default Router;
