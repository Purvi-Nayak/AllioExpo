import {MiddlewareAPI} from 'redux';
import * as actions from '../apiActions';

// local States reducers - global states to manage state across the app screens
const localStates =
  ({dispatch}: MiddlewareAPI) =>
  (next: any) =>
  async action => {
    if (action.type !== actions.apiCallBegan.type) return next(action);

    // destructured data and reducer local functions
    const {data, onChange, onReset} = action.payload;

    if (onChange) dispatch({type: onChange, payload: data});
    if (onReset) dispatch({type: onReset, payload: data});
  };

export default localStates;
