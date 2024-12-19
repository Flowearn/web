/**
 * 创建一个reducer，暂时不用，用官方 toolkit包里的 createReducer
 * @param initialState
 * @param handlers
 * @returns {(function(*=, *=): (*))|*}
 */
function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (Object.prototype.hasOwnProperty.call(handlers, action.type)) {
      return handlers[action.type](state, action);
    } else {
      return state;
    }
  };
}

export default createReducer;
