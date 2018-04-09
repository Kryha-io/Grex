import React from 'react';
import Logo from 'components/Logo';
import './index.css';

class Intro extends React.Component {
  render() {
    return (
      <div className="Intro">
        <Logo width={80} showName showSlogan />
      </div>
    );
  }
}

export default Intro;
