from flask import Flask, render_template, request # Import the class `Flask` from the `flask` module, written by someone else.

app = Flask(__name__, static_url_path='/static') # Instantiate a new web application called `app`, with `__name__` representing the current file

@app.route("/") # When the user goes to the route `/`, exceute the function immediately below
def index():
    return render_template("index.html")

@app.route("/about") # When the user goes to the route `/about`, exceute the function immediately below
def about():
    return render_template("about.html")

@app.route("/help") # When the user goes to the route `/help`, exceute the function immediately below
def help():
    return render_template("help.html")