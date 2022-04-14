
import payload from "./audio_annotations.data.json"

let data = {
    audio_annotations: {}
}

data.audio_annotations.data = payload;

console.log(data.audio_annotations.data)

export default function DisturbanceWave() {
    console.log(data.audio_annotations.data)
}