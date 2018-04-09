import React from 'react';
import CircularProgressBar from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { getWorldCoords } from 'services/mission/util';
import { fromJS } from 'immutable';
import './index.css';
import DroneVideo from '../DroneVideo';

class DroneInfo extends React.PureComponent {
  render() {
    const { gridBounds, id, type, action, location, currentBattery } = this.props;
    console.log(this.props);
    const worldCoords = getWorldCoords(gridBounds, fromJS(location));
    return (
      <div className="DroneInfo">
        <div className="DroneInfo-inner">
            {currentBattery !== undefined && (
                <div className="DroneInfo-inner-left">
                  <CircularProgressBar percentage={currentBattery} />
                </div>
            )}
          <div>
            <div className="DroneInfo-header">{type}{(type !== 'BEACON' && type !== 'ENERGY_STATION' && type !== 'REPAIR_STATION') && ' Drone'}</div>
            <div className="DroneInfo-id">{id}</div>
            <div className="DroneInfo-location">
                <div><span className="label">Lat:</span><span>{worldCoords.lat}</span></div>
                <div><span className="label">Lng:</span><span>{worldCoords.lng}</span></div>
            </div>
            {type === 'VIDEO' && <DroneVideo />}
          </div>
        </div>
      </div>
    );
  }
}

export default DroneInfo;
