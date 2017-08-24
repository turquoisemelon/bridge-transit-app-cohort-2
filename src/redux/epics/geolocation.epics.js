import { ACTION_TYPES } from '../../constants/ActionTypes';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/mergeMap';
import { GEO_CODE_API_KEY } from '../../constants/keys';

const GEOCODE_API = `https://maps.googleapis.com/maps/api/geocode/json?key=${GEO_CODE_API_KEY}&latlng=`;


const getPositionObservable = (geolocationOptions) => {
  return Observable.create(observer => {
    navigator.geolocation.getCurrentPosition(
      function successHandler (location) {
        observer.next(location);
      },
      function errorHandler (err) {
        observer.error(err);
      },
      geolocationOptions);
  });
};

export const geolocationEpic = (action$) =>
  action$.ofType(ACTION_TYPES.GET_GEOLOCATION)
    .mergeMap(() =>
      getPositionObservable({
        enableHighAccuracy: true,
        timeout: 5000,
      }).map(result => ({
        type: ACTION_TYPES.GET_FORMATTED_GEOLOCATION,
        payload: {
          lat: result.coords.latitude,
          lng: result.coords.longitude,
        }
      })).catch(error => Observable.of({
        type: ACTION_TYPES.SET_GEOLOCATION_INVALIDATE,
        payload: error
      }))
    );

    export const getFormattedGeolocation = (action$, _, {ajax}) =>
      action$.ofType(ACTION_TYPES.GET_FORMATTED_GEOLOCATION)
      .mergeMap(action =>
        ajax({url: `${GEOCODE_API}${action.payload.lat},${action.payload.lng}`, crossDomain: true})
          .map(({ response }) => ({
            type: ACTION_TYPES.SET_GEOLOCATION,
            payload: response,
          }))
          .catch(error => Observable.of({
            type: ACTION_TYPES.SET_GEOLOCATION_INVALIDATE,
            payload: error
          }))
      );
