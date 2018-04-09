import React from 'react';
import './index.css';

class CategorySelector extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <div className="CategorySelector">
        {children}
      </div>
    );
  }
}

export default CategorySelector;
