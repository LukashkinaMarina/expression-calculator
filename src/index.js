const calc = (operator, el1, el2) => {
  switch (operator) {
    case "+":
      return el1 + el2;
    case "-":
      return el1 - el2;
    case "*":
      return el1 * el2;
    case "/": {
      if (el2 === 0) {
        throw new Error("TypeError: Division by zero.");
      }
      return el1 / el2;
    }
  }
};

const isNumber = (val) => {
  return val === +val;
};

const getElement = (el1, struct) => {
  if (!isNumber(el1) && el1.includes("X")) {
    return Number(struct[el1.replace("X", "")][0]);
  }
  return Number(el1);
};

const getElements = (lev, i, struct) => {
  let el1 = lev[i - 1];
  let el2 = lev[i + 1];
  el1 = getElement(el1, struct);
  el2 = getElement(el2, struct);
  return [el1, el2];
};

const applyOperations = (first, second, lev, struct) => {
  let i = 0;
  while (lev.includes(first) || lev.includes(second)) {
    const sym = lev[i];
    if (sym === first || sym === second) {
      const [el1, el2] = getElements(lev, i, struct);
      lev[i - 1] = calc(sym, el1, el2);
      lev = lev.filter((el, index) => !(index === i || index === i + 1));
      i--;
      continue;
    }
    i++;
  }
  return lev;
};

const iterateStructure = (struct) => {
  for (let i = Object.keys(struct).length - 1; i >= 0; i--) {
    struct[i] = applyOperations("*", "/", struct[i], struct);
    struct[i] = applyOperations("+", "-", struct[i], struct);
  }
};

const pushElement = (structure, level, pre) => {
  if (!structure[level]) {
    structure[level] = [];
  }
  structure[level].push(pre);
};
const getLevel = (levels) => {
  return levels[levels.length - 1] || 0;
};
const expressionCalculator = (expr) => {
  let pre = "";
  const structure = {};
  const levelStructure = [];
  let levelCounter = 0;
  expr
    .split("")
    .filter((a) => a !== " ")
    .forEach((it) => {
      if (!"+-/*()".includes(it)) {
        pre += it;
      } else if (pre !== "") {
        pushElement(structure, getLevel(levelStructure), pre);
        if (it !== "(" && it !== ")") {
          pushElement(structure, getLevel(levelStructure), it);
        }
        pre = "";
      } else if (it !== "(" && it !== ")") {
        pushElement(structure, getLevel(levelStructure), it);
      }
      if (it === "(") {
        pushElement(
          structure,
          getLevel(levelStructure),
          `X${levelCounter + 1}`
        );
        levelCounter++;
        levelStructure.push(levelCounter);
      }
      if (it === ")") {
        if (getLevel(levelStructure) === 0) {
          throw new Error("ExpressionError: Brackets must be paired");
        }
        levelStructure.pop();
      }
    });
  if (getLevel(levelStructure) !== 0) {
    throw new Error("ExpressionError: Brackets must be paired");
  }
  if (pre) {
    pushElement(structure, getLevel(levelStructure), pre);
  }
  iterateStructure(structure);
  return structure[0][0];
};

module.exports = {
  expressionCalculator,
};
