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

# extract_audio('static/NeuralNetVideo.mp4', 'static/NeuralNetAudio.wav')
# transcript = transcribe_audio('static/NeuralNetVideo.mp4', static/NeuralNetAudio.wav', 'static/transcript.txt')
# print(transcript)