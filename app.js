function main() {

  console.log('loaded!');

  /* Primitive/Building-Block Functions */

  function clearInput() {
    document.getElementById('expression').value = '';
  }

  function clearDisplay() {
    document.getElementById('display').innerHTML = '';
  }

  function recursiveEval(string) {
    var parenthesesItem = /\(([^)(]+)\)/;   // P-
    var carat = /(\d+)\^(\d+)/;             // E-
    if (parenthesesItem.test(string)) {
      var matches = parenthesesItem.exec(string);

      var operator = /[\+\-\*\/\^\(]/;      // M-D-A-S
      console.log(matches);
      // must add '*' symbol before captured expression if opening parentheses were
      // not preceded by an explicit operator or another opening parentesis
      var needsMultiplicationSign = matches.index && !operator.test(matches.input.charAt(matches.index-1));
      
      var simplifiedPiece = needsMultiplicationSign ? 
                            "*" + recursiveEval(matches[1]) : 
                            recursiveEval(matches[1]);

      var modInput = matches.input.replace(matches[0], simplifiedPiece);

      return recursiveEval(modInput);

    } else if (carat.test(string)) {
      match = carat.exec(string);

      try {
        var base = match[1];
        var exponent = match[2];
        var result = 1;
        for (var i = 0; i < exponent; i++) {
          result *= base;
        }

        var modInput = match.input.replace(match[0], result);
        return recursiveEval(modInput);

      } catch (e) {
        console.log("Exception: " + e);
      }

      console.log(match);
    } else {
      return eval(string).toString();
    }
  }

  /* Implemented functions */

  function pullAnswer() {
    var numAnswers = document.getElementsByClassName('answerString').length;
    var input = document.getElementById('expression');
    if (numAnswers > 0) input.value += document.getElementsByClassName('answerString')[numAnswers-1].innerHTML;
    input.focus();
  }

  function calculateAndDisplay() {
    var inputString = document.getElementById('expression').value;
    var target = document.getElementById('display');
    try {
      console.log(recursiveEval(inputString));

      var newInput = document.createElement('div');
      var newAnswer = document.createElement('div');

      newInput.className = "inputString";
      newAnswer.className = "answerString";

      newInput.innerHTML = inputString;
      newAnswer.innerHTML = recursiveEval(inputString);

      var list = document.getElementById('display');
      if (list.childNodes.length > 5) {
        list.removeChild(list.childNodes[1])
        list.removeChild(list.childNodes[0])
      }

      target.appendChild(newInput);
      target.appendChild(newAnswer);

    } catch (e) {
      // if (!parenthesesTest) display Error: parentheses must align
      console.log("Error: exception " + e);
    }
    clearInput();
  }

  function clearAll() {
    clearInput();
    clearDisplay();
  }

  /* Add functionality for return key */

  function uniKeyCode(event) {
    var keyNum = event.which || event.keyCode;

    if (keyNum == 13) {
      calculateAndDisplay();
    }
  }

  /* Attach implemented functions to their respective elements */

  document.getElementById("ans-btn").onclick = pullAnswer;
  document.getElementById("eval-btn").onclick = calculateAndDisplay;
  document.getElementById("clear-btn").onclick = clearAll;
  document.getElementById("expression").onkeydown = function(){uniKeyCode(event)};

  
}
