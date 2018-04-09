import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

const propTypes = {
  width: PropTypes.number,
  showName: PropTypes.bool,
  showSlogan: PropTypes.bool,
};

const defaultProps = {
  width: 46,
  showName: true,
  showSlogan: true,
};

class Logo extends React.Component {
  render() {
    const { width, showName, showSlogan } = this.props;
    return (
      <div className="mt-1">
        <a href="/">
        <svg xmlns="http://www.w3.org/2000/svg" width={width} viewBox="0 0 107.18 93.45" className="bayleyssvg">
          <title>Asset 1</title>
          <g id="Layer_2" data-name="Layer 2">
          <g id="Eblems">
          <path className="cls-1 path" d="M103.72,90.76,3.47,90.87,28,48.32,53.62,4,79.21,48.32Zm0,0L40.12,27.17m-23.2,40.5,22.95,23,32.05-32" id="bayleys"/>
          </g>
          </g>
        </svg>
        {showName && <span className="Logo-name fadeIn">Grex</span>}
        {showSlogan && <span className="Logo-slogan fadeIn">A Decentral Hivemind</span>}
        </a>
      </div>
    );
  }
}

Logo.propTypes = propTypes;
Logo.defaultProps = defaultProps;

export default Logo;
