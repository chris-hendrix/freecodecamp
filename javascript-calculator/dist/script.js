class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prevType: '',
      prevVal: '0',
      value: '0',
      formula: '',
      display: ''
      //keyTrigger: 'N/A'
    };
    this.handleClick = this.handleClick.bind(this);
    handleClick = this.handleClick;
  }
  componentDidMount() {
    document.getElementById('formula-display').innerHTML = this.state.formula;
    document.getElementById('display').innerHTML = this.state.value;
  }
  componentWillUnmount() {
  }

  handleClick(e) {
    var prevVal = this.state.prevVal;
    var prevType = this.state.prevType;
    var value = e.target.value;
    var formula = this.state.formula + value;
    var type = getType(value);
    var display = this.state.display;


    // reset if last value is operator
    if (type === 'equals' && prevType === 'operator') {
      type = this.state.prevType;
      value = this.state.prevVal;
      formula = this.state.formula;
    }

    // clear equation if number after equals
    if (prevType === 'equals' && type !== 'operator') {
      formula = value;
    }

    // return if consecutive same operators
    if (type === 'operator' && prevVal === value) {return;}

    // number with multiple decimals
    if (type === 'decimal' && display.indexOf(".") > -1) {return;}

    //



    if (prevType === 'operator' && type === 'operator' && value !== '-') {
      formula = formula.substring(0, formula.length - 1) + value;
      console.log(formula);
    }

    if (prevVal === '-' && type === 'operator') {
      console.log('test');
      formula = formula.substring(0, formula.lastIndexOf(prevVal) - 1) + value;
    }

    // fix consectuive operators
    formula = formula.replace("+*", "*");
    formula = formula.replace("+/", "/");
    formula = formula.replace("-*", "*");
    formula = formula.replace("-/", "/");

    switch (type) {

      case 'integer':
        display = display + value;
        display = display.replace(/^0+/, '');
        if (display === '') {display = '0';}
        //display = parser.parse(display).result;
        if (display !== '0') {
          display = display.replace(/^0+/, '');
        }
        break;

      case 'clear':
        value = 0;
        display = 0;
        formula = '';
        break;

      case 'decimal':
        if (prevType === 'decimal') {return;}
        display = display + value;
        break;

      case 'equals':

        var parsed = parser.parse(this.state.formula);

        // handle other errors
        if (parsed.error != null) {
          value = parsed.error;
          formula = '';
          display = value;
        } else
        {
          value = parsed.result;
          formula = value;
          display = value;
        }

        break;
      case 'operator':
        display = '';
        break;
      default:}



    this.setState({
      prevVal: value,
      prevType: type,
      formula: formula,
      display: display });



    document.getElementById('formula-display').innerHTML = formula;
    document.getElementById('display').innerHTML = display;


  }


  render() {
    return /*#__PURE__*/(
      React.createElement("div", { id: "wrapper" }, /*#__PURE__*/
      React.createElement("div", { className: "display", id: "formula-display" }), /*#__PURE__*/

      React.createElement("div", { className: "display", id: "display" }), /*#__PURE__*/

      React.createElement(Buttons, {
        handleClick: this.handleClick })));



  }}


class Buttons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

  }

  render() {
    return /*#__PURE__*/(
      React.createElement("div", { id: "buttons" }, /*#__PURE__*/
      React.createElement("div", { id: "row1", className: "row" },
      getButton('seven', 7),
      getButton('eight', 8),
      getButton('nine', 9),
      getButton('add', '+')), /*#__PURE__*/

      React.createElement("div", { id: "row2", className: "row" },
      getButton('four', 4),
      getButton('five', 5),
      getButton('six', 6),
      getButton('subtract', '-')), /*#__PURE__*/

      React.createElement("div", { id: "row3", className: "row" },
      getButton('one', 1),
      getButton('two', 2),
      getButton('three', 3),
      getButton('multiply', '*')), /*#__PURE__*/

      React.createElement("div", { id: "row4", className: "row" },
      getButton('decimal', '.'),
      getButton('zero', 0),
      getButton('clear', 'C'),
      getButton('divide', '/')), /*#__PURE__*/

      React.createElement("div", { id: "row5", className: "row" },
      getButton('equals', '='))));




  }}


var handleClick;
var parser = new formulaParser.Parser();
function getButton(id = 'clear', value = 'C') {
  //console.log('pad= '+ index)
  //console.log(padBank[index])
  return /*#__PURE__*/(
    React.createElement("button", { id: id, className: "button", value: value, onClick: handleClick },
    value));



}

function getType(value) {
  if (Number.isInteger(+value)) {return 'integer';} else
  if (value === '.') {return 'decimal';} else
  if (value === 'C') {return 'clear';} else
  if (value === '=') {return 'equals';} else
  {return 'operator';}
}

ReactDOM.render( /*#__PURE__*/React.createElement(Calculator, null), document.getElementById('root'));