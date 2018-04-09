import React from 'react';
import './index.css';
import Webcam from 'react-webcam'

class DroneVideo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showVideo: true,
        };
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleOpen() {
        this.setState({ showVideo: true });
    }

  handleClose() {
    this.setState({ showVideo: false });
  }

  render() {
      const { showVideo } = this.state;
    const { streamUrl } = this.props;
    return (
      <div className={`DroneVideo DroneVideo-${showVideo ? 'show' : 'close'}`}>
        {!showVideo && <button className="show"><span className="icon-fullscreen" onClick={this.handleOpen} /></button>}
        {showVideo && <button className="close"><span className="icon-close" onClick={this.handleClose} /></button>}
        {showVideo && <Webcam className="video"/>}
        {/*<video src={streamUrl} />*/}
      </div>
    );
  }
}

export default DroneVideo;
