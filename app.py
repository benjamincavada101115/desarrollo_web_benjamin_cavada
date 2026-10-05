import os
from datetime import datetime
from flask import Flask, jsonify, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename

app = Flask(__name__)

UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://cc5002:programacionweb@localhost:3306/tarea2'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


class Region(db.Model):
    __tablename__ = 'region'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(200), nullable=False)

class Comuna(db.Model): 
    __tablename__ = 'comuna'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(200), nullable=False)
    region_id = db.Column(db.Integer, db.ForeignKey('region.id'), nullable=False)

class Voluntario(db.Model):
    __tablename__ = 'voluntario'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(80), nullable=False)
    telefono = db.Column(db.String(15), nullable=False)
    fecha_registro = db.Column(db.DateTime, nullable=False, default=datetime.now)
    comuna_id = db.Column(db.Integer, db.ForeignKey('comuna.id'), nullable=False)

class Ave(db.Model):
    __tablename__ = 'ave'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(80), nullable=False)

class Avistamiento(db.Model):
    __tablename__ = 'avistamiento'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    voluntario_id = db.Column(db.Integer, db.ForeignKey('voluntario.id'), nullable=False)
    ave_id = db.Column(db.Integer, db.ForeignKey('ave.id'), nullable=False)
    fecha_hora = db.Column(db.DateTime, nullable=False) 
    lugar = db.Column(db.String(200), nullable=False)
    descripcion = db.Column(db.Text, nullable=True)
    
    voluntario = db.relationship('Voluntario', backref='avistamientos', lazy=True)
    ave = db.relationship('Ave', backref='avistamientos', lazy=True)
    registros = db.relationship('Registro', backref='avistamiento', lazy=True)

class Registro(db.Model):
    __tablename__ = 'registro'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ruta_archivo = db.Column(db.String(300), nullable=False)
    nombre_archivo = db.Column(db.String(300), nullable=False)
    avistamiento_id = db.Column(db.Integer, db.ForeignKey('avistamiento.id'), nullable=False)


@app.route('/')
def index():
    ultimos = Avistamiento.query.order_by(Avistamiento.id.desc()).limit(2).all()
    return render_template('index.html', avistamientos=ultimos)

@app.route('/get_comunas/<int:region_id>')
def get_comunas(region_id):
    comunas = Comuna.query.filter_by(region_id=region_id).all()
    return jsonify([{'id': c.id, 'nombre': c.nombre} for c in comunas])

@app.route('/registrar_voluntario', methods=['GET', 'POST'])
def registrar_voluntario():
    if request.method == 'POST':
        nombre = request.form.get('nombre', '').strip()
        apellido = request.form.get('apellido', '').strip()
        email = request.form.get('email', '').strip()
        telefono = request.form.get('telefono', '').strip()
        comuna_id = request.form.get('comuna')

        if len(nombre) >= 3 and len(apellido) >= 3 and '@' in email and len(telefono) == 9 and comuna_id:
            nuevo = Voluntario(
                nombre=f"{nombre} {apellido}",
                email=email,
                telefono=telefono,
                fecha_registro=datetime.now(),
                comuna_id=int(comuna_id)
            )
            db.session.add(nuevo)
            db.session.commit()
            return redirect(url_for('index'))

    regiones = Region.query.all()
    return render_template('voluntario.html', regiones=regiones)

@app.route('/registrar_avistamiento', methods=['GET', 'POST'])
def registrar_avistamiento():
    if request.method == 'POST':
        voluntario_id = request.form.get('voluntario')
        ave_id = request.form.get('ave')
        lugar = request.form.get('lugar', '').strip()
        descripcion = request.form.get('descripcion', '').strip()
        fecha = request.form.get('fecha')
        hora = request.form.get('hora')
        archivos = request.files.getlist('foto-video')

        if voluntario_id and ave_id and len(lugar) >= 3 and fecha and hora:
            fecha_hora = datetime.strptime(f"{fecha} {hora}", "%Y-%m-%d %H:%M")
            
            avistamiento = Avistamiento(
                voluntario_id=int(voluntario_id),
                ave_id=int(ave_id),
                fecha_hora=fecha_hora,
                lugar=lugar,
                descripcion=descripcion
            )
            db.session.add(avistamiento)
            db.session.commit()

            for file in archivos:
                if file and file.filename:
                    filename = secure_filename(file.filename)
                    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                    file.save(filepath)

                    reg = Registro(
                        ruta_archivo=f"uploads/{filename}",
                        nombre_archivo=filename,
                        avistamiento_id=avistamiento.id
                    )
                    db.session.add(reg)

            db.session.commit()
            return redirect(url_for('index'))

    voluntarios = Voluntario.query.all()
    aves = Ave.query.all()
    return render_template('avistamiento.html', voluntarios=voluntarios, aves=aves)

@app.route('/consultar_avistamientos')
def consultar_avistamientos():
    tipo_ave = request.args.get('tipoAve', 'todos')
    orden = request.args.get('orden', 'fecha')
    orden_tipo = request.args.get('orden_tipo', 'asc')
    page = request.args.get('page', 1, type=int)

    query = Avistamiento.query

    if tipo_ave != 'todos' and tipo_ave:
        query = query.filter_by(ave_id=int(tipo_ave))

    if orden == 'lugar':
        columna_orden = Avistamiento.lugar
    else:
        columna_orden = Avistamiento.fecha_hora

    if orden_tipo == 'desc':
        query = query.order_by(columna_orden.desc())
    else:
        query = query.order_by(columna_orden.asc())

    paginacion = query.paginate(page=page, per_page=3, error_out=False)
    aves = Ave.query.all()

    return render_template(
        'avistamientos.html',
        paginacion=paginacion,
        aves=aves,
        tipo_ave=tipo_ave,
        orden=orden,
        orden_tipo=orden_tipo
    )

@app.route('/avistamiento/<int:id>')
def detalle_avistamiento(id):
    avistamiento = Avistamiento.query.get_or_404(id)
    return render_template('detalle_avistamiento.html', avistamiento=avistamiento)

@app.route('/ver_indicadores')
def ver_indicadores():
    return render_template('indicadores.html')

if __name__ == '__main__':
    app.run(debug=True)