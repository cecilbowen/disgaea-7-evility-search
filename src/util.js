export const getBuildFromString = (build, evilities) => {
    const evilityNumbers = build.split("_");
    const ret = [];
    for (const num of evilityNumbers) {
        const intNum = parseInt(num, 10);
        if (!isNaN(intNum)) {
            const ev = evilities.filter(x => x.number === intNum)[0];
            if (ev) {
                ret.push(ev);
            }
        }
    }

    return ret;
};

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// ported over from my battleship repo cause why not
export const generateRandomName = () => {
  // cvc(x..x)c
  const min = 5;
  const max = 8;
  let name = "";
  const vowels = "aeiou";
  const consonants = "bcdfghjklmnpqrstvwxyz";

  const length = getRandomInt(min, max);

  for (let i = 0; i < length; i++) {
    let v = true; // true for vowel, false for consonant
    if (i === 0 || i === 2 || i === length - 1) {
      v = false;
    }

    let add = '';
    if (v) {
      add = vowels[getRandomInt(0, vowels.length - 1)];
    } else {
      add = consonants[getRandomInt(0, consonants.length - 1)];
    }

    if (i === 0) {
      add = add.toUpperCase();
    }

    name += add;
  }

  return name;
};
