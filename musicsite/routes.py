from flask import render_template, request, jsonify, redirect, url_for, flash
import os
import random
from sqlalchemy.sql import func
from sqlalchemy import or_
from werkzeug.utils import secure_filename
from flask_login import current_user, logout_user, login_user

from musicsite import app, db, bcrypt
from .models import User, Music, FavoriteMusic
from .forms import RegisterForm, LoginForm

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



@app.route("/register", methods=["GET", "POST"])
def register():
    form = RegisterForm()

    if form.validate_on_submit():
        try:
            hashed_password = bcrypt.generate_password_hash(form.password.data).decode("utf-8")
            user = User(username=form.username.data, email=form.email.data, password=hashed_password)
            db.session.add(user)
            db.session.commit()
            logout_user()
            flash("Sikeres regisztráció! Kérlek jelentkezz be!", "success")
            return redirect(url_for("login"))
        except:
            flash("Sikertelen regisztráció, kérlek próbáld újra később!", "danger")
            return redirect(url_for("register"))
    
    return render_template("register.html", title="Regisztráció", form=form)
    

@app.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        flash("Már egyszer bejelentkeztél!", "warning")
        return redirect(url_for("home"))
    form = LoginForm()

    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()

        if user and bcrypt.check_password_hash(user.password, form.password.data):
            flash("Sikeres bejelentkezés!", "success")
            next = request.args.get("next")
            login_user(user, True)
            return redirect(next) if next else redirect(url_for("home"))
        else:
            flash("Sikertelen bejelentkezés!", "danger")
            return redirect(url_for("login"))


    return render_template("login.html", title="Bejelentkezés", form=form)


@app.route("/logout", methods=["GET", "POST"])
def logout():
    if current_user.is_authenticated:
        logout_user()
        flash("Sikeres kijelentkezés!", "success")
    else:
        flash("Ön jelenleg nincs bejelentkezve!", "warning")
        return redirect(url_for("home"))
    return redirect(url_for("login"))


@app.route("/media_player", methods=["GET", "POST"])
def media_player():
    if not current_user.is_authenticated:
        flash("Ehhez be kell jelentkezned!", "warning")
        return redirect(url_for("login"))
    musics = db.session.execute(db.select(Music)).scalars()

    search_data = request.args.get("search-music")
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


@app.route("/api/add_favorite", methods=["GET", "POST"])
def add_favorite():
    data = request.get_json()

    if data:
        music_title = data.get("musicTitle")
        music = Music.query.filter_by(title=music_title).first()

        favorite_music = FavoriteMusic(music_id=music.music_id, username=current_user.username, title=music.title)
        db.session.add(favorite_music)
        db.session.commit()

        musics = FavoriteMusic.query.filter_by(username=current_user.username).all()
        print(musics)
        return jsonify({"success": True})
    else:
        return jsonify({"success": False})
