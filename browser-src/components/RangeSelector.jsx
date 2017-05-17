import './RangeSelector.css';
import React, { PureComponent } from 'react';

// select time range
// click on update will update the History component based on the time range

export class RangeSelector extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      radio: null,
      textBox: null
    };
    this.changeRadio = this.changeRadio.bind(this);
    this.changeTextBox = this.changeTextBox.bind(this);
    this.validate = this.validate.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
    this.setState({ radio: this.props.range });
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.range !== nextProps.range) {
      if (nextProps.range === 900 || nextProps.range === 3600) {
        this.setState({ radio: nextProps.range });
      } else {
        this.setState({ textBox: nextProps.range, radio: -1 });
      }

    }
  }

  changeRadio(e) {
    this.setState({ radio: parseInt(e.target.value) })
  }

  changeTextBox(e) {
    this.setState({ textBox: parseInt(e.target.value) });
  }

  validate() {
    const { radio, textBox } = this.state;
    if (radio === -1) {
      return textBox > 0 && textBox <= 3600;
    } else {
      return radio > 0 && radio <= 3600;
    }
  }

  submit() {
    const { radio, textBox } = this.state;
    if (radio === -1) {
      this.props.changeRange(textBox)
    } else {
      this.props.changeRange(radio);
    }
  }

  render() {
    const { radio, textBox } = this.state;
    const { changeRange } = this.props;
    return <div className="RangeSelector">
      <label><input type="radio" value={900} checked={radio === 900} onChange={this.changeRadio} /> 15 minutes</label>
      <label><input type="radio" value={3600} checked={radio === 3600} onChange={this.changeRadio} /> 1 hour</label>
      <label><input type="radio" value={-1} checked={radio === -1} onChange={this.changeRadio}  /> Customize (1 to 3600 seconds):&nbsp;
      <input type="text" onChange={this.changeTextBox} onKeyPress={(e)=>this.setState({radio:-1})}/></label>
      <button disabled={!this.validate()} onClick={this.submit}>Update</button>
    </div>
  }
}