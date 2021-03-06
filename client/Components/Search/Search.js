import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux'
import _ from 'lodash';

import * as ClientActions from '../../Actions/client';
import * as ShowActions from '../../Actions/show';
import * as SearchActions from '../../Actions/search';

const tmdb = require('moviedb')('17c5a1d1fe283613b578056b9ee0b521');

import ResultList from './ResultList';

class Search extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      limit: this.props.limit || 8,
      placeholderText: '',
    }

    props.emptyResults();
    props.setQueryText('');
  }

  BackgroundRotator() {
    const backgrounds = [
      {name: 'Arrow', image: 'https://image.tmdb.org/t/p/w1920/dXTyVDTIgeByvUOUEiHjbi8xX9A.jpg'},
      // {name: 'Better Call Saul', image: 'https://image.tmdb.org/t/p/w1920/ljik3PqnobCL9fNYJRrDD8eTuFe.jpg'},
      // {name: 'Breaking Bad', image: 'https://image.tmdb.org/t/p/w1920/eSzpy96DwBujGFj0xMbXBcGcfxX.jpg'},
      {name: 'Black Sails', image: 'https://image.tmdb.org/t/p/w1920/5dMcDvKxqPgzSitf4cz6ug1P4Pv.jpg'},
      // {name: 'Colony', image: 'https://image.tmdb.org/t/p/w1920/10oorhbji4xt0RAYwMDWX4UCmGh.jpg'},
      // {name: 'Dark Matter', image: 'https://image.tmdb.org/t/p/w1920/3oYbblv7fGQJMRV5DohgYba3pxr.jpg'},
      // {name: 'Designated Survivor', image: 'https://image.tmdb.org/t/p/w1920/eq8mvitSr3wWSoYtsYLtHsmqxL4.jpg'},
      {name: 'Game of Thrones', image: 'https://image.tmdb.org/t/p/original/1bytxcN9WPA2B5QMJF1IRACvCVk.jpg'},
      // {name: 'Game of Thrones', image: 'https://image.tmdb.org/t/p/w1920/6AfC51zwWOEgCMXPlWKGHXMbDdq.jpg'}, // too much black
      {name: 'Grimm', image: 'https://image.tmdb.org/t/p/w1920/ocWDGFHxddYWcZYeenO1y7ULeIi.jpg'},
      // {name: 'Good Behavior', image: 'https://image.tmdb.org/t/p/w1920/mJ3UigMk8alBe5fVSMHUNY7oWon.jpg'},
      // {name: 'House of Cards', image: 'https://image.tmdb.org/t/p/w1920/3RognQsjLyE50cy5VMo28auGe9q.jpg'},
      // {name: 'Homeland', image: 'https://image.tmdb.org/t/p/w1920/4g3L3tKGZBemEupyqEzaPcJ7Tcu.jpg'},
      // {name: 'Incorporated', image: 'https://image.tmdb.org/t/p/w1920/dTcp50GZVvusHp9Bw9hRlOaTyhg.jpg'},
      // {name: 'Lucifer', image: 'https://image.tmdb.org/t/p/w1920/mcj4ZAh1WlswDx5i0xK1VIV03W7.jpg'},
      // {name: 'Marvel\'s Jessica Jones', image: 'https://image.tmdb.org/t/p/w1920/ihzq7HgeInN7iz8Y9K5yb71LVDJ.jpg'},
      {name: 'Mr. Robot', image: 'https://image.tmdb.org/t/p/w1920/toZQ9IN51cQMzy6fruBZ6024No3.jpg'},
      // {name: 'Silicon Valley', image: 'https://image.tmdb.org/t/p/w1920/8vk5R31KG5UQTAwTVEBxn65NSB.jpg'},
      {name: 'Suits', image: 'https://image.tmdb.org/t/p/w1920/iU2cObod4GoHAcgrc5AtfwIVizL.jpg'},
      {name: 'Supernatural', image: 'https://image.tmdb.org/t/p/w1920/o9OKe3M06QMLOzTl3l6GStYtnE9.jpg'},
      {name: 'The Blacklist', image: 'https://image.tmdb.org/t/p/w1920/6yDkRqCqpGkCvX49onaqG605gct.jpg'},
      // {name: 'The Expanse', image: 'https://image.tmdb.org/t/p/w1920/beIjmWr3OBOtcWK4tKMObOIDJ1C.jpg'},
      {name: 'The Flash', image: 'https://image.tmdb.org/t/p/w1920/9NzRllYCJyvn8SUnif6HyHPvLNH.jpg'},
      // {name: 'The Last Ship', image: 'https://image.tmdb.org/t/p/w1920/20txnfxxmpvqOdDqIiy2hO06qqG.jpg'},
      {name: 'The Magicians', image: 'https://image.tmdb.org/t/p/w1920/lYy3CCH3CLmTpzi2zT3sIMQjUvh.jpg'},
      // {name: 'The Strain', image: 'https://image.tmdb.org/t/p/w1920/pCKjrXsvzdq2CFH3OJJ03VeaIQr.jpg'},
      // {name: 'The Walking Dead', image: 'https://image.tmdb.org/t/p/w1920/zYFQM9G5j9cRsMNMuZAX64nmUMf.jpg'},
      // {name: 'The 100', image: 'https://image.tmdb.org/t/p/w1920/6hUX0tzbd68NIIVVrqX1Ozdz4k7.jpg'},
    ];

    const index = _.random(backgrounds.length-1);

    this.props.setBackground(backgrounds[index].image);
    this.setState({placeholderText: backgrounds[index].name})
  }

  componentDidMount() {
    this.BackgroundRotator();
    this.query.focus();
    this.query.addEventListener('keydown', this.handleSelection.bind(this));
  }

  componentWillUnmount() {
    this.query.addEventListener('keydown', this.handleSelection.bind(this));
  }

  handleSelection(e) {
    if (e.key == 'ArrowUp') {
      const selected = this.props.selectedResult-1;
      if (selected >= 0) {
        this.props.setSelectedResult(this.props.selectedResult > -1 ? selected : 0)
        // this.props.setQueryText(this.props.results[selected].name);
      }
      e.preventDefault();
    }
    else if (e.key == 'ArrowDown') {
      const selected = this.props.selectedResult+1;
      if (selected < this.state.limit) {
        this.props.setSelectedResult(selected);
        // this.props.setQueryText(this.props.results[selected].name);
      }
      e.preventDefault();
    }
    else if (e.key == 'Enter') {
      const show = this.props.results[this.props.selectedResult];
      this.props.setPartialShowDetails(show);
      this.props.setBackground(`https://image.tmdb.org/t/p/w1920${show.backdrop_path}`);
      this.props.dispatch(push(`/show/${show.id}`))
    }
  }

  handleChange(e) {
    this.props.setQueryText(e.target.value);
    if (this.query.value.length >= 3) {
      this.props.searchTV(this.query.value);
    } else {
      this.props.emptyResults();
    }
  }

  render() {

    return (
      <div className="search">
        <input
          type="text"
          autoComplete="off"
          ref={(c) => {this.query = c;}}
          placeholder={this.state.placeholderText}
          value={this.props.queryText}
          onChange={this.handleChange.bind(this)}
        />
        <ResultList limit={this.state.limit} selected={this.props.selectedResult} results={this.props.results} />
      </div>
    );
  }

}

Search.contextTypes = {
  router: React.PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    results: state.search.results,
    selectedResult: state.search.selected,
    queryText: state.search.query,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators({...ClientActions, ...ShowActions, ...SearchActions}, dispatch),
    dispatch
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
