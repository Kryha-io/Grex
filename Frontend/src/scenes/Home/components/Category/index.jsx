import React from 'react';
import PropTypes from 'prop-types';
import './index.css';

const propTypes = {
  name: PropTypes.string.isRequired,
  imgSrc: PropTypes.string.isRequired,
  imgAlt: PropTypes.string.isRequired,
};

class Category extends React.Component {
  render() {
    const { name, onCreate } = this.props;
    return (
      <div className="Category grow" onClick={() => onCreate()}>
        <div className="Overlay" onclick="off()"></div>
        <img src={this.props.imgSrc} alt={this.props.imgAlt} className="Gifs"/>
        <div className="Category-title">{name}</div>
      </div>
    );
  }
}

export default Category;
