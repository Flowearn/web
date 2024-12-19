/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2023-02-28 19:26:28
 * @LastEditors: chenhua
 * @LastEditTime: 2023-02-28 19:36:18
 */
/**
 * 描述： 全局状态 store 配置
 * @authorchenhua
 * @date 2021/12/13
 */

import { applyMiddleware, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import rootReducers from "../reducers";
import appReducer from "../reducers/appReducer";
import { logger } from "redux-logger";
/**
 * store的入口服务
 * @authorchenhua
 * @date $
 */

/**
 * 中间件的集合
 * @type {*[]}
 */
const middlewares = [];
const sagaMiddleware = createSagaMiddleware();
if (import.meta.env.NODE_ENV === "development") {
  middlewares.push(logger);
}

// middlewares.push(sagaMiddleware);

function configureStore(preloadedState) {
  const middlewareEnhancer = applyMiddleware(...[]);
  return createStore(rootReducers, preloadedState, middlewareEnhancer);
}

const appStore = configureStore();

//启动saga 中间件
// sagaMiddleware.run(sagas);

export default appStore;
