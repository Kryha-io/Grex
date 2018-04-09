import React from 'react';
import Logo from 'components/Logo';
import { withRouter } from 'react-router';
import './index.css';

class Header extends React.Component {
  render() {
    const { location } = this.props;
    let showName = false;
    let showSlogan = false;

    if (location.pathname === '/') {
      showName = true;
      showSlogan = true;
    }

    return (
      <div className="Header">
        <Logo showName={showName} showSlogan={showSlogan} />
      </div>
    );
  }
}

export default withRouter(Header);
