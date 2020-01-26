import React from 'react'
import { AsyncStorage } from 'react-native'
import { ContextProvider } from 'react-simplified-context'
import Navigator from './Navigator'
import ArticleItem from './components/ArticleItem'

export default class App extends React.Component {
  state = {
    articles: [{
      id: 1,
      title: '감정',
      content: `사람은 단어에서 감정을 배워.
단어가 없으면 사람은 자신의 감정을 훨씬 뭉뚱그려서 표현할 수 밖에 없어.
- 김철수씨 이야기`,
      date: '2019년 4월 5일',
      bookmarked: true,
    }, {
      id: 2,
      title: '감정2',
      content: `사람은 단어에서 감정을 배워.
단어가 없으면 사람은 자신의 감정을 훨씬 뭉뚱그려서 표현할 수 밖에 없어.
- 김철수씨 이야기`,
      date: '2019년 4월 5일',
      bookmarked: false,
    }],
    id: 3,
  }

  componentWillMount() {
    AsyncStorage.getItem('@diary:state').then((state) => {
      this.setState(JSON.parse(state))
    })
  }

  save = () => {
    AsyncStorage.setItem('@diary:state', JSON.stringify(this.state))
  }

  render() {
    return (

      <ContextProvider
        articles={this.state.articles}
        create={(title, content) => {
          const now = new Date()
          this.setState({
            articles: [{
              id: this.state.id,
              title: title,
              content: content,
              date: `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`,
              bookmarked: false,
            }].concat(this.state.articles),
            id: this.state.id + 1,
          }, this.save)
        }}
        update={(id, title, content) => {
          const newArticles = [...this.state.articles]
          const index = newArticles.findIndex(a => a.id === id)
          newArticles[index].title = title
          newArticles[index].content = content
          this.setState({ articles: newArticles }, this.save)
        }}
        toggle={(id) => {
          const newArticles = [...this.state.articles]
          const index = newArticles.findIndex(a => a.id === id)
          newArticles[index].bookmarked = !newArticles[index].bookmarked
          this.setState({ articles: newArticles }, this.save)
        }}
        remove={(id) => { 
          this.setState({
            articles: this.state.articles.filter((a) => a.id !== id) }, this.save)
        }}
      >
        <Navigator />
      </ContextProvider>
    );
  }
}
