


export type note = [  OscillatorNode, GainNode ]

export class AudioEngine {
  private audioCtx = new AudioContext()
  private activeNoteMap = new Map<string, note>()
  
  public decay = 0.01
  public attack = 0.01
  public monophonic = true 
  public waveform: OscillatorType = 'sine'


  rampNoteOn = (key: string, freq: number)=>{
  const currTime = this.audioCtx.currentTime
  const osc = this.audioCtx.createOscillator()
  const gain = this.audioCtx.createGain()
  osc.type = this.waveform
  osc.frequency.setValueAtTime(freq, currTime)
  osc.connect(gain)
  gain.connect(this.audioCtx.destination)

  this.activeNoteMap.set(key, [osc, gain])
  gain.gain.setValueAtTime(0, currTime)
  gain.gain.linearRampToValueAtTime(1, currTime+this.attack)
  osc.start(currTime)
  console.log(this.activeNoteMap)
  }

  rampNoteOff = (key :string)=>{
    console.log('rampingoff')
    const note = this.activeNoteMap.get(key)
    if(!note){
      return
    } 
    const osc = note[0]
    const gain = note[1]

    gain.gain.setValueAtTime(gain.gain.value, this.audioCtx.currentTime)
    gain.gain.linearRampToValueAtTime(0.0001, this.audioCtx.currentTime+this.decay)
    osc.stop(this.audioCtx.currentTime+this.decay)
    this.activeNoteMap.delete(key)
  }
  stopAll = ()=>{
  for(const activeNote of this.activeNoteMap){
    const note = activeNote[0]
    this.rampNoteOff(note)
  }
  this.activeNoteMap.clear()
  }
  getActiveNoteMap = ()=>{
    return this.activeNoteMap
  }
}