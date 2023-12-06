from flask import Flask, render_template, jsonify, request, send_from_directory, session
# request is the object to handle incoming requests
# from transcript import transcribe
# ^^ replaced by whisper:
import whisper

from chatbot import chat_with_bot
import os
from dotenv import load_dotenv
from openai import OpenAI

import chatbot


load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')

client = OpenAI(api_key=api_key)

app = Flask(__name__)

app.secret_key = 'FLASK_KEY'

# configure maximum file size: 100 MB
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024

#init chatbot
chatbot.main()

@app.route('/set_language', methods=['POST'])
def set_lang():
    data = request.get_json()
    selected_language = data['language']
    session['language'] = selected_language  # Store language in session
    print(session['language'])
    return {'status': 'Language changed'}, 200

@app.route('/explain', methods=['POST'])
def exlain_text():
    data = request.get_json()
    text_to_expl = data['textToExplain']
    chat_history = data['chatHistory'] # is a list

    explained_text = chat_with_bot('Please summarize the following text: ' + text_to_expl, 
                                    chat_history)

    return jsonify({'explanation': explained_text})

@app.route('/translate', methods=['POST'])
def translate_text():
    data = request.get_json()
    text_to_translate = data['textToTranslate']
    chat_history = data['chatHistory'] # is a list
    user_language = session.get('language', 'zh-TW') # chinese as a default
    print(user_language)
    print(chat_history)
    prompt = f"Please translate the following text into {user_language}: {text_to_translate}"

    translated_text = chat_with_bot(prompt, chat_history)

    return jsonify({'translation': translated_text})

@app.route('/summarize', methods=['POST'])
def summarize_text():
    data = request.get_json()
    text_to_summ = data['textToSummarize']
    chat_history = data['chatHistory'] # is a list
    print(chat_history)

    summ_text = chat_with_bot('Please summarize the following text: ' + text_to_summ, 
                                    chat_history)

    return jsonify({'summary': summ_text})


@app.route('/chat-with-bot', methods=['POST'])
def message():
    data = request.get_json()
    userInput = data['message']
    chatHistory = data['chatHistory']
    response = chat_with_bot(userInput, chatHistory)
    print(response)
    return response


# when the web server is accessed at the root URL ('/'), function index runs
# it finds index.html file in the templates folder and renders it
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/audio-files/<filename>')
def data(filename):
    return send_from_directory('audio-files', filename)


@app.route('/upload-video', methods=['POST'])
def upload_video():
    print("here")
    print(request.files)
    if 'video' not in request.files:
        return jsonify(error='No video part'), 400

    file = request.files['video']

    if file.filename == '':
        return jsonify(error='No selected video'), 400

    print("flag")
    if file and allowed_file(file.filename): # You might want to check file content type here as well.
        print("flag2")
        # Process video file to generate transcript
        # things to check - file size limit
        print(file.filename)
        
        # temporarily save the video file to the audio-files folder
        file.save(os.path.join('audio-files', file.filename))

        local_filename = os.path.join('audio-files', file.filename)

        # convert video to audio
        # POTENTIAL ERROR: WILL SHOW "NO SUCH FILE OR DIRECTORY"  
        # IF THE FILENAME CONTAINS SPACES
        # -y flag overwrites existing file
        command = "ffmpeg -i audio-files/" + file.filename + " audio-files/VideoAudio.wav -y"
        os.system(command)

        local_audio_filename = os.path.join('audio-files', 'VideoAudio.wav')

        model = whisper.load_model("base")
        transcript = model.transcribe(local_audio_filename)
        print("Transcribing done! Here's the transcript: ")
        print(transcript["text"])

        return jsonify(transcript=transcript)
    

def allowed_file(filename):
    # Check if file extension is allowed
    # do later - which extensions should we allow?
    ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'flv', 'wmv'}
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

if __name__ == '__main__':
    app.run(debug=True, port=3000)
