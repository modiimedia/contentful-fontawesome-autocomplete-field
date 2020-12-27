import React from 'react';
import { Button, Card, TextInput} from '@contentful/forma-36-react-components';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import icons from '../fontawesome'

interface SearchSuggestion {
  name: string;
  value: string;
  searchTerms: string[]
}

const items: SearchSuggestion[] = []

Object.keys(icons).forEach(key => {
  const icon = icons[key]
  for (const style of icon.styles) {
    if (style === 'brands') {
      items.push({
        name: `${key.toUpperCase()} (BRAND)`,
        value: `fab fa-${key}`,
        searchTerms: icon.search.terms || []
      })
    }
    if (style === 'regular') {
      items.push({
        name: `${key.toUpperCase()} (REGULAR)`,
        value: `far fa-${key}`,
          searchTerms: icon.search.terms || []

      })
    }
    if (style === 'solid') {
      items.push({
        name: `${key.toUpperCase()} (SOLID)`,
        value: `fas fa-${key}`,
        searchTerms: icon.search.terms || []
      })
    }
  }
})

const getSuggestions = (value: string) => {
  if (!value) {
    return []
  }
  const searchVal = value.toLowerCase()
  const suggestions = []
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (suggestions.length > 10) {
      break;
    }
    let shouldPush = false
    if (item.name.toLowerCase().includes(searchVal)) {
      shouldPush = true
    } else if (item.value.toLowerCase().includes(searchVal)) {
      shouldPush = true
    } else if (item.searchTerms.length) {
      for (const term of item.searchTerms) {
        if (term.toLowerCase().includes(searchVal)) {
          shouldPush = true
        }
      }
    }
    if (shouldPush) {
      suggestions.push(item)
    }
  }
  console.log(suggestions)
  return suggestions
}

interface FieldProps {
  sdk: FieldExtensionSDK;
}

interface IState {
  value: string;
  suggestions: SearchSuggestion[];
  showSearch: boolean;
}



class Field extends React.Component<FieldProps, IState> {
  state: IState = {
    value: this.props.sdk.field.getValue(),
    suggestions: getSuggestions(this.props.sdk.field.getValue()),
    showSearch: false,
  }
  updateValue = (e: React.ChangeEvent) => {
    if (!e.target) {
      return null
    }
    if (e.target instanceof HTMLInputElement) {
      const { value } = e.target
      this.setState({
        value: value,
        suggestions: getSuggestions(value)
      })
      // return this.props.sdk.field.setValue(value)
    }
  }
  toggleSearch = () => {
    const {showSearch} = this.state
    this.setState({
      showSearch: !showSearch
    })
  }
  updateField = (value: string) => {
    this.setState({
      value: value,
      suggestions: getSuggestions(value),
      showSearch: false
    })
    return this.props.sdk.field.setValue(value)  }
  render() {
    return <div className="f36-font-family--sans-serif f36-color--text-dark">
      {this.state.showSearch ? <div>
        <TextInput value={this.state.value} onChange={this.updateValue} className={'fixed'} />
        <div className={'f36-padding-top--2xl'}>
        {this.state.suggestions.map((suggestion, index) => {
          return <div key={`suggestion-${index}-${suggestion.value}`} className={'f36-padding--s hover-background f36-font-size--m'} onClick={() => this.updateField(suggestion.value)}>
            <div className="flex items-center f36-margin-bottom--s">
              <span className={'f36-padding-right--s'}><i className={suggestion.value}></i></span><span className={"text-bold"}>{suggestion.name}</span>
            </div>
            <div className="f36-color--text-mid">{suggestion.value}</div>
          </div>
        })}
          </div>
      </div> : <Card style={{height: "115px"}}>
        <div className="f36-margin-bottom--m">
          <span className="f36-font-size--xl f36-padding-right--s">
            <i className={this.state.value}></i>
          </span>
          <span>{this.state.value}</span>
        </div>
        <Button buttonType="primary" size="small" onClick={this.toggleSearch}>Change Icon</Button>
      </Card>}
    </div>
  }
}
export default Field;
