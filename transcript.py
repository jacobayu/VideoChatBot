import ffmpeg
import whisper
import json

def extract_audio(video_path, output_audio_path):
    {
    ffmpeg.input(video_path)
	.output(output_audio_path)
	.run()
    }

def transcribe(video_path, audio_path, transcript_path):
    extract_audio(video_path, audio_path)

    # Load the Whisper model
    model = whisper.load_model("base")

    # Process the audio file and generate the transcription
    result = model.transcribe(audio_path)

    with open(transcript_path, 'w', encoding='utf-8') as file:
        json.dump(result, file, ensure_ascii=False, indent=4)

    # Return the transcription text
    return result


def transcribe_audio(audio_path, transcript_path):

    # Load the Whisper model
    model = whisper.load_model("base")

    # Process the audio file and generate the transcription
    result = model.transcribe(audio_path)

    with open(transcript_path, 'w', encoding='utf-8') as file:
        json.dump(result, file, ensure_ascii=False, indent=4)

    # Return the transcription text
    return result

#extract_audio('static/stylerVideo.mp4', 'audio-files/VideoAudio.wav')
transcribe_audio('audio-files/VideoAudio.wav', 'audio-files/VidTranscript.json')
# transcript = transcribe_audio('audio-files/NeuralNetAudio.wav', 'audio-files/VidTranscript.txt')
# print(transcript)