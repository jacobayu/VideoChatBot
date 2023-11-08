from flask import Flask, render_template

app = Flask(__name__)

# when the web server is accessed at the root URL ('/'), function index runs
# it finds index.html file in the templates folder and renders it
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
