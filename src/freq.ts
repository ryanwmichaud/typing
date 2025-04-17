const noteToFreq = new Map<string, number>([
    ['C', 8.175779],
    ['C#', 8.661957], 
    ['D', 9.177027], 
    ['D#', 9.722718], 
    ['E', 10.300861],
    ['F', 10.913383], 
    ['F#', 11.562325], 
    ['G', 12.249857], 
    ['G#',  12.978271], 
    ['A', 13.750], 
    ['A#', 14.567617], 
    ['B', 15.433853 ]
  ])
const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  
type pitchedNote = [string, number]
 
const guitar: pitchedNote[] = [
  ['E',6],
  ['B',5],
  ['G',5],
  ['D',5],
  ['A',4]
]
const banjo: pitchedNote[] = [
  ['D',6],
  ['B',5],
  ['G',5],
  ['D',5]
]

const keysStandard = [
  ['2','3','4','5','6','7','8','9','0','-','='],
  ['q','w','e','r','t','y','u','i','o','p','[',']'],
  ['a','s','d','f','g','h','j','k','l',';','\''],
  ['Shift', 'z','x','c','v','b','n','m',',','.','/']

]
const keys = [
  ['`','1','2','3','4','5','6','7','8','9','0','-','=','Backspace','Home'],
  ['Escape','Tab','q','w','e','r','t','y','u','i','o','p','[',']','\\'],
  ['F1','CapsLock','a','s','d','f','g','h','j','k','l',';','\'','Enter','Help'],
  ['F2','Shift', 'z','x','c','v','b','n','m',',','.','/','Shift','','Delete'],
  ['F3', 'Control','Meta','Alt','F5','F6','F8',' ','F9','F10','F11','F12','ArrowLeft','','ArrowRight']

]

export let keyToFreq = new Map<string, number>()

export const updateKeyToFreq = (newTuning: pitchedNote[])=>{
  for (let stringIndex=0; stringIndex<newTuning.length; stringIndex++){
    const row = keys[stringIndex]
    const openNoteIndex = noteNames.indexOf(newTuning[stringIndex][0])
    const openOctave = newTuning[stringIndex][1]
    for(let keyIndex=0; keyIndex<row.length; keyIndex++){
      const key = row[keyIndex]
      const noteName = noteNames[(openNoteIndex+keyIndex)%12]
      const octave = openOctave + Math.floor((openNoteIndex+keyIndex)/12)
      const freq = noteToFreq.get(noteName)! * (2**octave)
      keyToFreq.set(key, freq)
    }
  
  }
}
updateKeyToFreq(guitar)
 
 /*
  const fretToNote: Record<string, string> = {
    '1': 'E',
    '2': 'F', 
    '3': 'F#', 
    '4': 'G', 
    '5': 'G#', 
    '6': 'A', 
    '7': 'A#', 
    '8': 'B', 
    '9': 'C', 
    '0': 'C#', 
    '-': 'D', 
    '=': 'D#',
    'q': 'B', 
    'w': 'C', 
    'e': 'C#', 
    'r': 'D', 
    't': 'D#', 
    'y': 'E', 
    'u': 'F', 
    'i': 'F#', 
    'o': 'G', 
    'p': 'G#', 
    '[': 'A',
    ']': 'A#' 
  }
  */
  /*
  const tuning: pitchedNote[] = [
    ['D',5],
    ['B',4],
    ['G',4],
    ['D', 4]
  ]
*/