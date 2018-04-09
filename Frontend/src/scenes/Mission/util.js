import { chain, groupBy, toPairs, zipObject, value } from 'lodash';

export function groupDrones(drones) {
  return chain(drones.toJS())
    .groupBy('type')
    .toPairs()
    .map((currentItem) => {
      return zipObject(['type', 'drones'], currentItem);
    })
    .value();
}
