import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let bandOchMusiker = [];

// Ladda tidigare data från JSON-fil, om den finns
try {
  const data = fs.readFileSync('data.json', 'utf8');
  bandOchMusiker = JSON.parse(data);
} catch (error) {
  console.error('Fel vid inläsning av JSON-fil:', error);
}

function saveData() {
  fs.writeFile('data.json', JSON.stringify(bandOchMusiker), (err) => {
    if (err) {
      console.error('Fel vid sparande av data:', err);
    }
  });
}

function addBandOrMusician() {
  rl.question('Ange namn på band eller musiker: ', (name) => {
    if (name.trim()) {
      bandOchMusiker.push(name);
      saveData();
    }
    listBandsAndMusicians();
  });
}

function removeBandOrMusician() {
  rl.question('Ange numret på band eller musiker att ta bort: ', (input) => {
    const index = parseInt(input);
    if (!isNaN(index) && index >= 1 && index <= bandOchMusiker.length) {
      const removedItem = bandOchMusiker.splice(index - 1, 1)[0];
      console.log(`Raderade: ${removedItem}`);
      saveData();
    } else {
      console.log('Ogiltigt nummer. Vänligen ange ett nummer från listan.');
    }
    listBandsAndMusicians();
  });
}

function listBandsAndMusicians() {
  console.log('Band och Musiker:');
  for (let i = 0; i < bandOchMusiker.length; i++) {
    console.log(`${i + 1}. ${bandOchMusiker[i]}`);
  }
  console.log('\n');
  console.log('Välj en åtgärd:');
  console.log('1. Lägg till band eller musiker');
  console.log('2. Ta bort band eller musiker');
  console.log('3. Avsluta');
  rl.question('Ange numret för åtgärd: ', (choice) => {
    if (choice === '1') {
      addBandOrMusician();
    } else if (choice === '2') {
      removeBandOrMusician();
    } else if (choice === '3') {
      rl.close();
    } else {
      console.log('Ogiltigt val. Välj en giltig åtgärd.');
      listBandsAndMusicians();
    }
  });
}

listBandsAndMusicians();
