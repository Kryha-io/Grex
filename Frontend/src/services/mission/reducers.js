import { fromJS, List, Map } from 'immutable';
import * as types from './types';

function mission(state = { drones: List() }, action) {
  const { type, id, drones, focusedDrone, drone } = action;
  switch (type) {
    case types.INIT_MISSION:
      return {
        id,
        focusedDrone,
        drones,
      };
    case types.SET_FOCUSED_DRONE:
      return {
        ...state,
        focusedDrone,
      };
    case types.SET_SINGLE_DRONE:
      const immDrone = fromJS(drone);
      const index = state.drones.findIndex((d) => d.get('id') === drone.id);
      const updatedDrones = index > -1 ? state.drones.set(index, immDrone) : state.drones.push(immDrone);
      return {
        ...state,
        drones: updatedDrones,
      };
    case types.SET_DRONES:
      return {
        ...state,
        drones: fromJS(drones),
      };
    default:
      return state;
  }
}

export default {
  mission,
};
