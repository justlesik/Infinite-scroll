import urls from '../../constants/urls';
import {
  GET_BEER_LIST_INIT,
  GET_BEER_LIST_SUCCESS,
  GET_BEER_LIST_FAIL
} from './constants';

const getBeerListInit = () => ({
  type: GET_BEER_LIST_INIT
});

const getBeerListSuccess = payload => ({
  type: GET_BEER_LIST_SUCCESS,
  payload
});

const getBeerListFail = () => ({
  type: GET_BEER_LIST_FAIL
});

export const getBeerList = (pageNumber = 1) => dispatch => {
  dispatch(getBeerListInit());

  const request = fetch(`${urls.getBeerList}?page=${pageNumber}`);

  request
    .then(res => res.json())
    .then(data => {
      dispatch(getBeerListSuccess(data));
    })
    .catch(err => {
      dispatch(getBeerListFail());
    });
};
