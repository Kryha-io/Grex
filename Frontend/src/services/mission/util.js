const GRID_STEPS = 100;

export function getWorldCoords(gridBounds, gridCoords) {
  const vertStepSize = Math.abs(gridBounds.south - gridBounds.north) / GRID_STEPS;
  const horzStepSize = Math.abs(gridBounds.east - gridBounds.west) / GRID_STEPS;
  return {
    lat: gridBounds.north - (vertStepSize * gridCoords.get('y')),
    lng: gridBounds.west + (horzStepSize * gridCoords.get('x')),
  };
}
