from flask import Flask, render_template, jsonify, request, send_from_directory
# request is the object to handle incoming requests
from transcript import transcribe
from chatbot import chat_with_bot
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')

client = OpenAI(api_key=api_key)

app = Flask(__name__)

# configure maximum file size: 100 MB
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024

@app.route('/explain/<selectedText>')
def explain(selectedText):
    return chat_with_bot('Please explain the following text: ' + selectedText)

@app.route('/translate/<selectedText>')
def translate(selectedText):
    pass

@app.route('/summarize/<selectedText>')
def summarize(selectedText):
    return chat_with_bot('Please summarize the following text: ' + selectedText)

@app.route('/chat-with-bot', methods=['POST'])
def message():
    data = request.get_json()
    userInput = data['message']
    response = chat_with_bot(userInput)
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
        # Process video file to generate transcript
        # things to check - file size limit
        print(file.filename)
        transcript = transcribe(file.filename, 'audio-files/VideoAudio.wav', 'audio-files/VidTranscript.txt')
        return jsonify(transcript=transcript)

def allowed_file(filename):
    # Check if file extension is allowed
    # do later - which extensions should we allow?
    ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'flv', 'wmv'}
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

if __name__ == '__main__':
    app.run(debug=True)
