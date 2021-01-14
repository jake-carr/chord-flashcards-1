export const notes = [
    "A",
    "A♯ (B♭)",
    "B",
    "C",
    "C♯ (D♭)",
    "D",
    "D♯ (E♭)",
    "E",
    "F",
    "F♯ (G♭)",
    "G",
    "G♯ (A♭)",
];

export const indexToString = (index) => {
    return notes[index]
};

export const parse = (index) => {
    if (index > 23) {
        return index - 24;
    } else if (index > 11) {
        return index - 12;
    } else return index;
};

const randomNote = () => {
    let i = (Math.floor(Math.random() * 12));
    return i
}

export const chordTypes = ["Major", "Minor"];

const randomType = () => {
    let i = (Math.floor(Math.random() * chordTypes.length));
    return chordTypes[i]
}

const createChord = (rootIndex, chordType) => {
    if (chordType === "Minor") {
        let type = "Minor";
        let root = rootIndex;
        let third = parse(rootIndex + 3);
        let fifth = parse(rootIndex + 7);
        let notes = [root, third, fifth];
        return { notes, type }
    }
    if (chordType === "Major") {
        let type = "Major";
        let root = rootIndex;
        let third = parse(rootIndex + 4);
        let fifth = parse(rootIndex + 7);
        let notes = [root, third, fifth];
        return { notes, type }
    }
}

export const generateChord = () => {
    return createChord(randomNote(), randomType());
}
