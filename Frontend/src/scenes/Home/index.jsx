import React from 'react';
import PropTypes from 'prop-types';
import Intro from './components/Intro';
import CategorySelector from './components/CategorySelector';
import Category from './components/Category';

const propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.handleCreate = this.handleCreate.bind(this);
  }

  // async handleCreate(e) {
  //   try {
  //     const res = await fetch(`http:// /api/createMission`, {
  //       method: 'POST',
  //       headers: new Headers({
  //         'Content-Type': 'application/json'
  //       }),
  //     });
  //     console.log('created mission', res.json());
  //     const resJson = res.json();
  //     this.props.history.push({ pathname: `/mission/${resJson.id}` });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  handleCreate() {
    this.props.history.push({ pathname: '/mission' });
  }

  render() {
    return (
      <div>
        {/*<Intro />*/}
        <CategorySelector>
          <Category
            name="Planetary Observation"
            imgSrc="https://media.giphy.com/media/7vAfO2V6hD4ZoYvvZ3/giphy.gif"
            imgAlt=""
            onCreate={this.handleCreate}
          />
          <Category
            name="Building"
            imgSrc="https://media.giphy.com/media/OqFILVTtyMnsndIWh6/giphy.gif"
            imgAlt=""
            onCreate={this.handleCreate}
          />
          <a href="/mission">
              <Category
                name="Search & Rescue"
                imgSrc="https://media.giphy.com/media/1Ago3fCisrbEz49fkS/giphy.gif"
                imgAlt=""
                onCreate={this.handleCreate}
              />
          </a>
          <Category
            name="Wildlife Protection"
            imgSrc="https://media.giphy.com/media/1j9lIbzgW1aT0TxoQW/giphy.gif"
            imgAlt=""
            onCreate={this.handleCreate}
          />
        </CategorySelector>
      </div>
    );
  }
}

Home.propTypes = propTypes;

export default Home;
