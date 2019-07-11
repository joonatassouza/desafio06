import React, { Component } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Loading,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: true,
    loadingMore: false,
    page: 1,
    lastPage: false,
  };

  componentDidMount() {
    this.refreshList();
  }

  refreshList = async () => {
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    this.setState({ loading: true });

    const response = await api.get(`/users/${user.login}/starred?per_page=10`);

    this.setState({
      stars: response.data,
      loading: false,
      page: 1,
      lastPage: false,
    });
  };

  loadMore = async () => {
    const { stars, page, lastPage } = this.state;

    if (lastPage) {
      return;
    }

    const { navigation } = this.props;
    const user = navigation.getParam('user');

    this.setState({ loadingMore: true });

    const response = await api.get(
      `/users/${user.login}/starred?per_page=10&page=${page + 1}`
    );

    if (!response.data || !response.data.length) {
      this.setState({
        stars: [...stars, ...response.data],
        loadingMore: false,
        page: page + 1,
        lastPage: true,
      });
    } else {
      this.setState({
        stars: [...stars, ...response.data],
        loadingMore: false,
        page: page + 1,
      });
    }
  };

  handleNavigate = star => {
    const { navigation } = this.props;

    navigation.navigate('Repository', {
      name: star.full_name,
      url: star.html_url,
    });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, loadingMore } = this.state;

    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <Loading />
        ) : (
          <>
            <Stars
              onRefresh={this.refreshList}
              refreshing={loading}
              onEndReachedThreshold={0.2}
              onEndReached={this.loadMore}
              data={stars}
              keyExtractor={star => String(star.id)}
              renderItem={({ item }) => (
                <Starred onPress={() => this.handleNavigate(item)}>
                  <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                  <Info>
                    <Title>{item.name}</Title>
                    <Author>{item.owner.login}</Author>
                  </Info>
                </Starred>
              )}
            />
            {loadingMore && <Loading />}
          </>
        )}
      </Container>
    );
  }
}
