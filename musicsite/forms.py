from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, EmailField, SubmitField, BooleanField
from wtforms.validators import DataRequired, Email, EqualTo



class RegisterForm(FlaskForm):
    username = StringField(render_kw={"placeholder": "Felhasználónév"}, validators=[DataRequired()])
    email = EmailField(render_kw={"placeholder": "E-mail"}, validators=[DataRequired(), Email(message="Ez az E-mail cím már foglalt!")])
    password = PasswordField(render_kw={"placeholder": "Jelszó"}, validators=[DataRequired()])
    confirm_password = PasswordField(render_kw={"placeholder": "Jelszó újra"}, validators=[DataRequired(), EqualTo("password", message="A két jelszó nem egyezik meg!")])
    show_password = BooleanField()
    submit = SubmitField("Regisztráció")


class LoginForm(FlaskForm):
    username = StringField(render_kw={"placeholder": "Felhasználónév"}, validators=[DataRequired()])
    password = PasswordField(render_kw={"placeholder": "Jelszó"}, validators=[DataRequired()])
    submit = SubmitField("Bejelentkezés")