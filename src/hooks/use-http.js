import { useReducer, useCallback } from 'react';
import { useDispatch } from 'react-redux';
// import { authActions } from '../store/auth';

function httpReducer(state, action) {
  switch (action.type) {
    case 'SEND':
      return {
        data: null,
        error: null,
        status: 'pending',
      };
    case 'SUCCESS':
      return {
        data: action.responseData,
        error: null,
        status: 'completed',
      };
    case 'ERROR':
      return {
        data: action.responseData,
        error: action.errorMessage,
        status: 'error',
      };
    default:
      return state;
  }
}

function useHttp(requestFunction, startWithPending = false) {
  const dispatch1 = useDispatch();
  const [httpState, dispatch] = useReducer(httpReducer, {
    status: startWithPending ? 'pending' : null,
    data: null,
    error: null,
  });

  const sendRequest = useCallback(
    async function (requestData) {
      dispatch({ type: 'SEND' });
      try {
        const responseData = await requestFunction(requestData);
        if (responseData.error && responseData.error === 'Unauthorized') {
          dispatch({
            type: 'ERROR',
            errorMessage: 'Email and Password do not match!',
            responseData,
          });
        } else if (responseData.message && responseData.error) {
          dispatch({
            type: 'ERROR',
            errorMessage: responseData.message,
            responseData,
          });
        } else {
          dispatch({ type: 'SUCCESS', responseData });
        }
      } catch (error) {
        // Uncomment if needed
        // if (error.status === 401 || error.status === 403) {
        //   dispatch1(authActions.logout());
        // }
        dispatch({
          type: 'ERROR',
          errorMessage: error.message || 'Something went wrong!',
          responseData: null, // Or set error.responseData if needed
        });
      }
    },
    [requestFunction, dispatch1]
  );

  return {
    sendRequest,
    ...httpState,
  };
}

export default useHttp;
