function newElement(tag, attrs, parent) {
  const newElem = document.createElement(tag);
  parent = parent ? parent : document.body;
  parent.append(newElem);
  for (const key in attrs) {
    newElem.setAttribute(key, attrs[key])
  }
  return newElem
}

function toggleVisibleById(elementId) {
  const element = document.getElementById(elementId);
  if (element.style.visibility === "hidden") {
    element.style.visibility = null;
  } else {
    element.style.visibility = "hidden";
  }
}


// function copyToClipboard() {
//   inputField.value = inputField.value.replace(cursorChar, "");
//   inputField.select();
//   try {
//     document.execCommand('copy');
//     keyTest.textContent = 'Copied text!';
//     inputInterceptor.focus();
//   } catch (err) {
//     keyTest.textContent = 'Unable to copy text';
//     console.error('Unable to copy text', err);
//   }
// }

function fetchJSON(url, updateFunction) {
  fetch(url)
    .then(function (promise) {
      return promise.json();
    })
    .then(function (data) {
      updateFunction(data);
    })
    .catch(function (error) {
      console.error('Error:', error);
    });
}

const capitalize = (text) => text[0].toUpperCase() + text.slice(1);

const jpnName = newElement("h3");
const engName = newElement("h3");
const testImg = newElement("img");

const evoInfo = newElement("h4");

const testInput = newElement("input");
const searchButton = newElement("button");
searchButton.textContent ="Search";

testInput.focus();

function getAllEvolutions(evodata) {
  console.log({evodata});
  let currentNode = evodata.chain;
  const evolutions = [currentNode.species.name];
  console.log("evolutions: ", evolutions);
  while (true) {
    // if (!currentNode.evolves_to) { break; }
    try {
      currentNode = currentNode.evolves_to[0]
      evolutions.push(currentNode.species.name);
    } catch (error) {
      break;
    }
  }
  return evolutions.join(" => ")
}

searchButton.addEventListener("click", () => {
  testImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${testInput.value}.png`
  fetchJSON(
    `https://pokeapi.co/api/v2/pokemon-species/${testInput.value}/`,
    (speciesData) => {
      jpnName.textContent = speciesData.names[0].name;
      const name = speciesData.name;
      engName.textContent = capitalize(name);
      const evoChainUrl = speciesData.evolution_chain.url;
      console.log("evoChainUrl: ", evoChainUrl);
      fetchJSON(
        evoChainUrl,
        (evodata) => {
          // evoInfo.textContent += evodata.chain.species.name;
          evoInfo.textContent = getAllEvolutions(evodata);
        }
      );
    }
  );
});
