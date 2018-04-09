import { createSelector } from 'reselect';
import { Map } from 'immutable';

export const getFocusedDroneId = state => state.mission && state.mission.focusedDrone;
export const getDrones = state => state.mission && state.mission.drones;

/**
 *
 */
export const getFocusedDrone = createSelector(
  getFocusedDroneId,
  getDrones,
  (focusedDroneId, drones) => {
    if (!focusedDroneId) {
      return undefined;
    }

    return drones.find((drone) => drone.get('id') === focusedDroneId);
  },
);
