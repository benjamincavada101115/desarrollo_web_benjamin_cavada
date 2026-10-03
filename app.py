from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://cc5002:programacionweb@localhost:3306/tarea2'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/registrar_voluntario')
def registrar_voluntario():
    return render_template('voluntario.html')

@app.route('/registrar_avistamiento')
def registrar_avistamiento():
    return render_template('avistamiento.html')

@app.route('/consultar_avistamientos')
def consultar_avistamientos():
    return render_template('avistamientos.html')

@app.route('/ver_indicadores')
def ver_indicadores():
    return render_template('indicadores.html')

if __name__ == '__main__':
    app.run(debug=True)