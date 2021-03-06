import _ from 'lodash';
import moment from 'moment';
const tmdb = require('moviedb')(process.env.TMDB_KEY);

exports.getTVById = function (req, res) {
  // TODO: check mongo cache for the show details
  // if they don't exist then do a external api call
  tmdb.tvInfo({id: req.params.id, append_to_response: 'credits,external_ids'}, function(err, results){
if (err) return res.status(err.status).json({error: err, success: false});
    return res.status(200).json({
      results,
      success: true
    });
  });
}

exports.searchTV = function (req, res) {
  // TODO: after i preload my own DB with popular shows switch this from external api call to local db call
  tmdb.searchTv({ query: req.query.query }, (err, results) => {
if (err) return res.status(err.status).json({error: err, success: false});
    return res.status(200).json({
      results,
      success: true
    });
  });
}

exports.nextEpisode = function (req, res) {
  // expects an show id and current season
  tmdb.tvSeasonInfo({ id: req.params.id, season_number: req.params.season }, (err, results) => {
    if (err) return res.status(err.status).json({error: err, success: false});
    const indexOfEpisode = _.findIndex(results.episodes, function (episode) {
      const airDate = moment(episode.air_date);
      return airDate.isSameOrAfter(moment(), 'day');
    });
    if (indexOfEpisode > -1) {
      return res.status(200).json({
        results: results.episodes[indexOfEpisode],
        success: true
      });
    }
    return res.status(200).json({
      results: 'No episode available',
      success: false
    });
  });
}
