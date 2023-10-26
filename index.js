import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class Musician {
  constructor(name, birthYear) {
    this.name = name;
    this.birthYear = birthYear;
    this.bands = [];
  }

  getAge() {
    return new Date().getFullYear() - this.birthYear;
  }
}

class Band {
  constructor(name) {
    this.name = name;
    this.members = [];
  }
}

class MusicLibrary {
  constructor() {
    this.bands = [];
    this.musicians = [];
  }

  saveData() {
    fs.writeFileSync('bands.json', JSON.stringify(this.bands));
    fs.writeFileSync('musicians.json', JSON.stringify(this.musicians));
  }

  addBand(name) {
    this.bands.push(new Band(name));
    this.saveData();
  }

  addMusician(name, birthYear) {
    this.musicians.push(new Musician(name, birthYear));
    this.saveData();
  }

  removeBand(index) {
    this.bands.splice(index, 1);
    this.saveData();
  }

  removeMusician(index) {
    this.musicians.splice(index, 1);
    this.saveData();
  }

  addMusicianToBand(musicianIndex, bandIndex) {
    const musician = this.musicians[musicianIndex];
    const band = this.bands[bandIndex];
    musician.bands.push(band.name);
    band.members.push(musician.name);
    this.saveData();
  }

  removeMusicianFromBand(musicianIndex, bandIndex) {
    const musician = this.musicians[musicianIndex];
    const band = this.bands[bandIndex];
    musician.bands = musician.bands.filter(name => name !== band.name);
    band.members = band.members.filter(name => name !== musician.name);
    this.saveData();
  }

  listBands() {
    console.log('Band:');
    this.bands.forEach((band, index) => console.log(`${index + 1}. ${band.name}`));
  }

  listMusicians() {
    console.log('Musiker:');
    this.musicians.forEach((musician, index) => console.log(`${index + 1}. ${musician.name}`));
  }
}

const musicLibrary = new MusicLibrary();

try {
  const bandsData = fs.readFileSync('bands.json', 'utf8');
  const musiciansData = fs.readFileSync('musicians.json', 'utf8');
  musicLibrary.bands = JSON.parse(bandsData);
  musicLibrary.musicians = JSON.parse(musiciansData);
} catch (error) {
  console.error('Fel vid inläsning av JSON-filer:', error);
}

function handleMenuChoice(choice) {
  switch (choice) {
    case '1':
      rl.question('Ange namn på band: ', (name) => {
        if (name.trim()) {
          musicLibrary.addBand(name);
        }
        listBandsAndMusicians();
      });
      break;
    case '2':
      rl.question('Ange namn på musiker: ', (name) => {
        if (name.trim()) {
          rl.question('Ange födelseår för musikern: ', (birthYear) => {
            if (!isNaN(birthYear)) {
              musicLibrary.addMusician(name, parseInt(birthYear));
            } else {
              console.log('Ogiltigt födelseår. Ange ett nummer.');
            }
            listBandsAndMusicians();
          });
        } else {
          console.log('Ogiltigt namn för musikern.');
          listBandsAndMusicians();
        }
      });
      break;
    case '3':
      rl.question('Välj en åtgärd:\n1. Ta bort band\n2. Ta bort musiker\n', (removeChoice) => {
        if (removeChoice === '1') {
          musicLibrary.listBands();
          rl.question('Ange numret på band att ta bort: ', (bandIndex) => {
            const index = parseInt(bandIndex);
            if (!isNaN(index) && index >= 1 && index <= musicLibrary.bands.length) {
              musicLibrary.removeBand(index - 1);
            } else {
              console.log('Ogiltigt nummer. Vänligen ange ett nummer från listan.');
            }
            listBandsAndMusicians();
          });
        } else if (removeChoice === '2') {
          musicLibrary.listMusicians();
          rl.question('Ange numret på musiker att ta bort: ', (musicianIndex) => {
            const index = parseInt(musicianIndex);
            if (!isNaN(index) && index >= 1 && index <= musicLibrary.musicians.length) {
              musicLibrary.removeMusician(index - 1);
            } else {
              console.log('Ogiltigt nummer. Vänligen ange ett nummer från listan.');
            }
            listBandsAndMusicians();
          });
        } else {
          console.log('Ogiltigt val. Välj en giltig åtgärd.');
          listBandsAndMusicians();
        }
      });
      break;
    case '4':
      musicLibrary.listBands();
      rl.question('Välj ett band att lägga till musiker till (ange bandets nummer): ', (bandIndex) => {
        const selectedBandIndex = parseInt(bandIndex);
        if (!isNaN(selectedBandIndex) && selectedBandIndex >= 1 && selectedBandIndex <= musicLibrary.bands.length) {
          musicLibrary.listMusicians();
          rl.question('Välj en musiker att lägga till i bandet (ange musikerns nummer): ', (musicianIndex) => {
            const selectedMusicianIndex = parseInt(musicianIndex);
            if (!isNaN(selectedMusicianIndex) && selectedMusicianIndex >= 1 && selectedMusicianIndex <= musicLibrary.musicians.length) {
              musicLibrary.addMusicianToBand(selectedMusicianIndex - 1, selectedBandIndex - 1);
            } else {
              console.log('Ogiltigt nummer. Vänligen ange ett nummer från listan.');
            }
            listBandsAndMusicians();
          });
        } else {
          console.log('Ogiltigt nummer. Vänligen ange ett nummer från listan.');
          listBandsAndMusicians();
        }
      });
      break;
    case '5':
      musicLibrary.listMusicians();
      rl.question('Välj en musiker att ta bort från ett band (ange musikerns nummer): ', (musicianIndex) => {
        const selectedMusicianIndex = parseInt(musicianIndex);
        if (!isNaN(selectedMusicianIndex) && selectedMusicianIndex >= 1 && selectedMusicianIndex <= musicLibrary.musicians.length) {
          const selectedMusician = musicLibrary.musicians[selectedMusicianIndex - 1];
          musicLibrary.listBands();
          rl.question('Välj ett band att ta bort musikern från (ange bandets nummer): ', (bandIndex) => {
            const selectedBandIndex = parseInt(bandIndex);
            if (!isNaN(selectedBandIndex) && selectedBandIndex >= 1 && selectedBandIndex <= musicLibrary.bands.length) {
              musicLibrary.removeMusicianFromBand(selectedMusicianIndex - 1, selectedBandIndex - 1);
            } else {
              console.log('Ogiltigt nummer. Vänligen ange ett nummer från listan.');
            }
            listBandsAndMusicians();
          });
        } else {
          console.log('Ogiltigt nummer. Vänligen ange ett nummer från listan.');
          listBandsAndMusicians();
        }
      });
      break;
    case '6':
      musicLibrary.listMusicians();
      rl.question('Ange numret på musikern att visa information om: ', (musicianIndex) => {
        const index = parseInt(musicianIndex);
        if (!isNaN(index) && index >= 1 && index <= musicLibrary.musicians.length) {
          musicLibrary.viewMusician(index - 1);
        } else {
          console.log('Ogiltigt nummer. Vänligen ange ett nummer från listan.');
        }
        listBandsAndMusicians();
      });
      break;
    case '7':
      musicLibrary.listBands();
      rl.question('Ange numret på band att visa information om: ', (bandIndex) => {
        const index = parseInt(bandIndex);
        if (!isNaN(index) && index >= 1 && index <= musicLibrary.bands.length) {
          musicLibrary.viewBand(index - 1);
        } else {
          console.log('Ogiltigt nummer. Vänligen ange ett nummer från listan.');
        }
        listBandsAndMusicians();
      });
      break;
    case '8':
      rl.close();
      break;
    default:
      console.log('Ogiltigt val. Välj en giltig åtgärd.');
      listBandsAndMusicians();
  }
}

function listBandsAndMusicians() {
  musicLibrary.listBands();
  musicLibrary.listMusicians();
  console.log('\nVälj en åtgärd:');
  console.log('1. Lägg till band');
  console.log('2. Lägg till musiker');
  console.log('3. Ta bort band eller musiker');
  console.log('4. Lägg till musiker till ett band');
  console.log('5. Ta bort musiker från ett band');
  console.log('6. Visa information om en musiker');
  console.log('7. Visa information om ett band');
  console.log('8. Avsluta');
  rl.question('Ange numret för åtgärd: ', handleMenuChoice);
}

listBandsAndMusicians();