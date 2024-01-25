from flask import render_template, request, jsonify, redirect, url_for
import os
import random
from sqlalchemy.sql import func
from werkzeug.utils import secure_filename

from musicsite import app, db
from .models import User, Music


with app.app_context():
    db.create_all()
    music_folder_path = os.path.join(app.static_folder, "music")

    for root, dirs, files in os.walk(music_folder_path):
        for file in files:
            if file.endswith(".mp3"):
                music_path = os.path.join(root, file)
                title = os.path.splitext(file)[0]
                music = Music(title=title)
                db.session.add(music)
    db.session.commit()


@app.route("/")
@app.route("/home")
def home():
    return render_template("index.html", title="Kezdőlap")




@app.route("/media_player", methods=["GET", "POST"])
def media_player():
    return render_template("media_player.html", title="Lejátszó")


@app.route("/api/get_music", methods=["GET", "POST"])
def get_music():

    music = Music.query.order_by(func.random()).first()

    return  jsonify({"success": True, "title": music.title})

