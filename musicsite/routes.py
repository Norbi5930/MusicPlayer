from flask import render_template, request, jsonify, redirect, url_for
import os
import random
from sqlalchemy.sql import func
from sqlalchemy import or_
from werkzeug.utils import secure_filename

from musicsite import app, db
from .models import User, Music


#with app.app_context():
#    db.create_all()
#    music_folder_path = os.path.join(app.static_folder, "music")
#
#    for root, dirs, files in os.walk(music_folder_path):
#        for file in files:
#            if file.endswith(".mp3"):
#                music_path = os.path.join(root, file)
#                title = os.path.splitext(file)[0]
#                music = Music(title=title)
#                db.session.add(music)
#    db.session.commit()


@app.route("/")
@app.route("/home")
def home():
    return render_template("index.html", title="Kezdőlap")




@app.route("/media_player", methods=["GET", "POST"])
def media_player():
    musics = db.session.execute(db.select(Music)).scalars()

    search_data = request.args.get("search-music")
    print("Data: ", search_data)
    if search_data:
        search = True
        musics = Music.query.filter(or_(Music.title.like(f"%{search_data}%"))).all()
    else:
        search = False

    return render_template("media_player.html", title="Lejátszó", musics=musics, search=search)


@app.route("/api/get_music", methods=["GET", "POST"])
def get_music():
    data = request.get_json()

    if data:
        oldMusic = data.get("old_music")

    music = Music.query.order_by(func.random()).first()
    while music == oldMusic:
        music = Music.query.order_by(func.random()).first()

    return  jsonify({"success": True, "title": music.title})

