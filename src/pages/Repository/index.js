import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Browser, Loading } from './styles';

export default class Repository extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('name'),
  });

  static propTypes = {
    navigation: PropTypes.shape({
      url: PropTypes.string,
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    url: '',
    loading: true,
  };

  componentDidMount() {
    const { navigation } = this.props;

    this.setState({
      url: navigation.getParam('url'),
      loading: true,
    });
  }

  render() {
    const { url, loading } = this.state;

    return (
      <>
        <Browser
          onLoadStart={() => this.setState({ loading: true })}
          onLoadEnd={() => this.setState({ loading: false })}
          source={{ uri: url }}
        />
        {loading && <Loading />}
      </>
    );
  }
}
