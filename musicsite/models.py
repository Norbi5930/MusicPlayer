from musicsite import db, login_manager
from flask_login import UserMixin

@login_manager.user_loader
def load_user(id):
    return User.query.get(str(id))



class User(db.Model, UserMixin):
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)


    def get_id(self):
        return self.user_id


class Music(db.Model):
    __tablename__ = "Musics"
    music_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)