import './App.scss';
import React, { useEffect } from "react";
import { generateChord, indexToString, notes, chordTypes } from "./constants/utils"

function App() {

  const stringifyNoteArray = (arr) => {
    let result = [];
    for (let i = 0; i < arr.length; i++) {
      result.push(indexToString(arr[i]))
    }
    return result.join(' - ')
  }

  let [feed, changeFeed] = React.useState('');
  let [feedID, changeFeedID] = React.useState('');

  const successMsgs = ["success", "correct", "hooray", "true", "swell", "nice", "easy", "1"];
  const failureMsgs = ["does not compute", "incorrect", "wrong", "false", "tragic", "try again", "no", "0"];
  const recordMsg = "New record!";
  const pickRandom = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  let [flipped, toggleFlipped] = React.useState(false);
  const flip = () => {
    toggleFlipped(!flipped);
  }

  let [autoGenerate, toggleAuto] = React.useState(true);
  const toggleAutoGenerate = () => {
    toggleAuto(!autoGenerate);
  }
  let [record, updateRecord] = React.useState(0);
  let [streak, updateStreak] = React.useState(0);

  const success = () => {
    let n = streak + 1;
    updateStreak(n);
    changeFeed(pickRandom(successMsgs));
    changeFeedID("success");
    checkIfRecord(n);
    if (autoGenerate) {
      clear();
      generate();
    }
  }

  const fail = () => {
    updateStreak(0);
    changeFeed(pickRandom(failureMsgs));
    changeFeedID("failure");
    if (autoGenerate) {
      clear();
      generate();
    }
  }

  const checkIfRecord = (value) => {
    if (value > record && value > 1) {
      changeFeed(recordMsg);
      changeFeedID("record");
      updateRecord(value);
    }
  }

  const [selectedNotes, changeSelection] = React.useState({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
    10: false,
    11: false,
  });

  const [selectedChordType, changeSelectedChordType] = React.useState("");

  const selectChord = (string) => {
    changeSelectedChordType(string);
  }

  const [activeChordName, changeChordName] = React.useState([]);
  const [activeChordNotes, changeChordNotes] = React.useState([]);

  const select = (noteIndex) => {
    for (var key in selectedNotes) {
      if (Number(key) === noteIndex) {
        let update = { ...selectedNotes };
        update[key] = !update[key];
        changeSelection(update);
      }
    }
  }

  const clear = () => {
    const empty = {
      0: false,
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
      9: false,
      10: false,
      11: false,
    };
    changeSelection(empty);
    changeSelectedChordType('');
  }

  const submit = () => {
    const selection = [];
    for (var key in selectedNotes) {
      if (selectedNotes[key] === true) {
        selection.push(Number(key));
      }
    }
    let flag = false;
    if (!flipped) {
      selection.sort();
      const comparison = [...activeChordNotes].sort();
      if (!selection.length || selection.length !== comparison.length) {
        flag = true;
      }
      for (var i = 0; i < selection.length; i++) {
        if (selection[i] !== comparison[i]) {
          flag = true;
        }
      }
    }
    if (flipped) {
      const answer = indexToString(selection) + " " + selectedChordType;
      const comparison = activeChordName;
      if (!answer.length || answer.length !== comparison.length) {
        flag = true;
      }
      for (var j = 0; j < answer.length; j++) {
        if (answer[j] !== comparison[j]) {
          flag = true;
        }
      }
    }
    flag ? fail() : success();
  }

  const generate = () => {
    clear();
    const chord = generateChord();
    changeChordName(indexToString(chord.notes[0]) + " " + chord.type);
    changeChordNotes(chord.notes);
  }

  const renderChordTypes = () => {
    return chordTypes.map((type, idx) => {
      return (
        <div className="checkbox-container" key={[type, idx]}>
          <button
            className="checkbox"
            id={selectedChordType === type ? "checked" : "unchecked"}
            onClick={() => {
              selectChord(type)
            }}
          >
          </button>
          <span className="checkbox-label">
            {type}
          </span>
        </div>
      )
    })
  }


  const renderButtonGrid = () => {
    return notes.map((note, idx) => {
      return (
        <div className="checkbox-container" key={[note, idx]}>
          <button
            className="checkbox"
            id={selectedNotes[idx] === true ? "checked" : "unchecked"}
            onClick={() => {
              select(idx);
            }}
          >
          </button>
          <span className="checkbox-label">
            {note}
          </span>
        </div>
      );
    });
  }

  useEffect(() => {
    generate();
    // eslint-disable-next-line
  }, []);


  return (
    <div className="App">
      <div className="app-header">
        <h4>CHORD FLASHCARDS</h4>
        <div className="score-container">
          <div className="score">Streak <span>{streak}</span></div>
          <div className="score">Record <span>{record}</span></div>
        </div>
        <div className="main-button-container">
          <button className="main-button" onClick={() => generate()}>
            Generate
          </button>
          <button className="main-button" onClick={() => flip()}>
            Flip
          </button>
        </div>
        <div className="flashcard">
          {flipped ? stringifyNoteArray(activeChordNotes) : activeChordName}
        </div>
      </div>
      <div className="user-form">
        <div className="button-grid">
          {renderButtonGrid()}
        </div>
        <div className="chord-type-options">
          {flipped ? renderChordTypes() : null}
        </div>
        <div className="grid-controls">
          <button className="form-button" onClick={() => [clear(), changeFeed('')]}>Clear</button>
          <button className="form-button" onClick={() => submit()}>Submit</button>
        </div>
        <div className="feed" id={feedID}>
          {feed}
        </div>
        <div className="checkbox-container" id="auto-generate-toggler">
          <button
            className="checkbox"
            id={autoGenerate ? "checked" : "unchecked"}
            onClick={() => {
              toggleAutoGenerate()
            }}
          >
          </button>
          <span className="checkbox-label">
            Auto generate new chord on each submission
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
