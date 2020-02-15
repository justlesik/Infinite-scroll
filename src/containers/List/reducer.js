import {
  GET_BEER_LIST_INIT,
  GET_BEER_LIST_SUCCESS,
  GET_BEER_LIST_FAIL
} from './constants';

const initialState = {
  beerList: [],
  isLoading: false
};

const listReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BEER_LIST_INIT:
      return { ...state, isLoading: true };

    case GET_BEER_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        beerList: [...state.beerList, ...action.payload]
      };

    case GET_BEER_LIST_FAIL:
      return { ...state, isLoading: false };

    default:
      return state;
  }
};

export default listReducer;
