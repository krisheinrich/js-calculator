function main() {

  console.log('loaded!');

  /* Utility Functions */

  function clearInput() {
    document.getElementById('expression').value = '';
  }

  function clearDisplay() {
    document.getElementById('display').innerHTML = '';
  }

  function clearAll() {
      clearInput();
      clearDisplay();
    }

  function parenthesesAreBalanced(s) {
    var parentheses = "()",
        stack = [],
        i,
        c;

    for (i = 0; c = s[i++];) {
      var bracePosition = parentheses.indexOf(c),
        braceType;
      //~ is truthy for any number but -1
      if (!~bracePosition)
        continue;

      braceType = bracePosition % 2 ? 'closed' : 'open';

      if (braceType === 'closed') {
        //If there is no open parenthese at all, return false OR
        //if the opening parenthese does not match ( they should be neighbours )
        if (!stack.length || parentheses.indexOf(stack.pop()) != bracePosition - 1)
          return false;
      } else {
        stack.push(c);
      }
    }

    return !stack.length;
  }

  function recursiveEval(string) {
    // Verify input has no alphabetical characters
    if (string.match(/[a-z]/i)) {
      throw new Error("Invalid character");
    }

    // Verify input has no 2 decimals on the same "number"
    if (string.match(/\.\d*\./)) {
      throw new Error("Invalid decimal format");
    }

    // Capture first parenthetical term in the input string
    var parenthesesItem = /\(([^)(]+)\)/;             // P-
    // Capture first base and exponent pair
    var carat = /(\d+)(\.(\d+))?\^(-?\d+)(\.(\d+))?/; // E-

    // If the input string has parentheses, call this function on the first such grouping.
    // Else, if there is an exponent, evaluate it and call this function on the modified string.
    // Else, run the native eval() and return the result as a string.
    if (parenthesesItem.test(string)) {

      // Check for matching number of parentheses
      if (!parenthesesAreBalanced(string)) {
        throw new Error("Parenthesis mismatch");
      }

      var matches = parenthesesItem.exec(string);

      // Add '*' symbol before captured expression if opening parenthesis was
      // not preceded by an explicit operator or another opening parentesis
      var operator = /[\+\-\*\/\^\(]/;                // M-D-A-S
      var needsMultiplicationSign = matches.index && !operator.test(matches.input.charAt(matches.index-1));
      var simplifiedPiece = needsMultiplicationSign ?
                            "*" + recursiveEval(matches[1]) :
                            recursiveEval(matches[1]);
      var modInput = matches.input.replace(matches[0], simplifiedPiece);
      console.log(modInput);

      return recursiveEval(modInput);

    } else if (carat.test(string)) {
      var match = carat.exec(string);

      console.log(match);
      var base = match[2] ? match[1]+match[2] : match[1],
          exponent = match[5] ? match[4]+match[5] : match[4],
          result = Math.pow(base, exponent);

      var modInput = match.input.replace(match[0], result);

      return recursiveEval(modInput);
    } else {
      // Return floating point result of input expression
      return eval(string);
    }
  }

  /* Implemented functions */

  function pullAnswer() {
    var answerList = Array.prototype.slice.call(document.getElementsByClassName('answerString')),
        input = document.getElementById('expression');
        console.log(answerList);

    if (answerList.length > 0) {
      var prevAnswer = answerList[answerList.length - 1].innerHTML || '';
      input.value += prevAnswer;
    }
    input.focus();
  }

  function calculateAndDisplay() {
    var inputString = document.getElementById('expression').value;
    var target = document.getElementById('display');
    // Create divs for new input and answer strings
    var newInput = document.createElement('div');
    var newAnswer = document.createElement('div');

    try {
      var answer = recursiveEval(inputString);
      console.log(answer);

      if (!isFinite(answer)) {
        throw new Error('Answer not defined');
      }

      // Populate with input and calculated answer
      newInput.className = "inputString";
      newAnswer.className = "answerString";
      newInput.innerHTML = inputString;
      newAnswer.innerHTML = parseFloat(answer.toPrecision(10))

      clearInput();

    } catch (e) {
      // if (!parenthesesTest) display Error: parentheses must align
      console.log(e);

      // Display error to user
      newInput.className = "inputString";
      newAnswer.className = "errorString";
      newInput.innerHTML = inputString;
      newAnswer.innerHTML = '<code>' + e + '</code>';

    } finally {
      // Attach new input & answer lines to calculator display
      var list = document.getElementById('display');
      if (list.childNodes.length > 5) {
        list.removeChild(list.childNodes[1]);
        list.removeChild(list.childNodes[0]);
      }
      target.appendChild(newInput);
      target.appendChild(newAnswer);
    }
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
