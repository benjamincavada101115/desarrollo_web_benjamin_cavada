import os
import re
import uuid
from datetime import datetime, timedelta
from flask import Flask, jsonify, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = 'clave_secreta_cc5002_tarea3'

UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'mp4', 'mov', 'avi', 'webm'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://cc5002:programacionweb@localhost:3306/tarea2'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

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

class Comentario(db.Model):
    __tablename__ = 'comentario'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre = db.Column(db.String(80), nullable=False)
    texto = db.Column(db.String(300), nullable=False)
    fecha = db.Column(db.DateTime, nullable=False, default=datetime.now)
    avistamiento_id = db.Column(db.Integer, db.ForeignKey('avistamiento.id'), nullable=False)

    avistamiento = db.relationship('Avistamiento', backref=db.backref('comentarios', lazy=True))


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

    regiones = Region.query.all()

    if request.method == 'POST':
        nombre = request.form.get('nombre', '').strip()
        apellido = request.form.get('apellido', '').strip()
        email = request.form.get('email', '').strip()
        telefono = request.form.get('telefono', '').strip()
        comuna_id = request.form.get('comuna').strip()

        errores = []

        if len(nombre) < 3 or len(nombre) > 100:
            errores.append("El nombre debe tener entre 3 y 100 caracteres.")
        if len(apellido) < 3 or len(apellido) > 100:
            errores.append("El apellido debe tener entre 3 y 100 caracteres.")

        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email) or len(email) > 80:
            errores.append("El correo electrónico no tiene un formato válido o supera los 80 caracteres.")

        if not (telefono.isdigit() and len(telefono) == 9):
            errores.append("El teléfono debe contener exactamente 9 dígitos numéricos.")

        comuna_obj = db.session.get(Comuna, int(comuna_id)) if comuna_id.isdigit() else None
        if not comuna_obj:
            errores.append("Debe seleccionar una comuna válida existente.")

        if errores:
            return render_template('voluntario.html', regiones=regiones, errores=errores)

        nuevo = Voluntario(
            nombre=f"{nombre} {apellido}",
            email=email,
            telefono=telefono,
            fecha_registro=datetime.now(),
            comuna_id=comuna_obj.id
        )
        db.session.add(nuevo)
        db.session.commit()

        flash("¡Voluntario registrado con éxito!", "exito_voluntario") #CAMBIAR
        return redirect(url_for('index'))
    
    return render_template('voluntario.html', regiones=regiones)

@app.route('/registrar_avistamiento', methods=['GET', 'POST'])
def registrar_avistamiento():

    voluntarios = Voluntario.query.all()
    aves = Ave.query.all()

    if request.method == 'POST':
        voluntario_id = request.form.get('voluntario', '').strip()
        ave_id = request.form.get('ave', '').strip()
        lugar = request.form.get('lugar', '').strip()
        descripcion = request.form.get('descripcion', '').strip()
        fecha = request.form.get('fecha', '').strip()
        hora = request.form.get('hora', '').strip()
        archivos = request.files.getlist('foto-video')

        errores = []

        voluntario_obj = db.session.get(Voluntario, int(voluntario_id)) if voluntario_id.isdigit() else None
        if not voluntario_obj:
            errores.append("Debe seleccionar un voluntario válido.")

        ave_obj = db.session.get(Ave, int(ave_id)) if ave_id.isdigit() else None
        if not ave_obj:
            errores.append("Debe seleccionar un tipo de ave válido.")

        if len(lugar) < 3 or len(lugar) > 200:
            errores.append("El lugar debe tener entre 3 y 200 caracteres.")
        if len(descripcion) > 500:
            errores.append("La descripción no puede superar los 500 caracteres.")

        fecha_hora = None
        if not fecha or not hora:
            errores.append("La fecha y la hora son obligatorias.")
        else:
            try:
                fecha_hora = datetime.strptime(f"{fecha} {hora}", "%Y-%m-%d %H:%M")
                ahora = datetime.now()
                if fecha_hora > ahora:
                    errores.append("La fecha y hora del avistamiento no pueden ser futuras.")
                elif fecha_hora < (ahora - timedelta(days=365)):
                    errores.append("La fecha del avistamiento no puede tener más de 1 año de antigüedad.")
            except ValueError:
                errores.append("El formato de fecha u hora no es válido.")

        archivos_validos = [f for f in archivos if f and f.filename and f.filename.strip()]
        if len(archivos_validos) == 0:
            errores.append("Debe subir al menos una foto o video del avistamiento.")
        else:
            for file in archivos_validos:
                if not allowed_file(file.filename):
                    errores.append(f"El archivo '{file.filename}' no tiene un formato permitido (imágenes o videos).")

        if errores:
            return render_template('avistamiento.html', voluntarios=voluntarios, aves=aves, errores=errores)

        avistamiento = Avistamiento(
            voluntario_id=voluntario_obj.id,
            ave_id=ave_obj.id,
            fecha_hora=fecha_hora,
            lugar=lugar,
            descripcion=descripcion
        )
        db.session.add(avistamiento)
        db.session.commit()

        for file in archivos_validos:
            original_name = secure_filename(file.filename)
            unique_name = f"{uuid.uuid4().hex}_{original_name}"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_name)
            file.save(filepath)

            reg = Registro(
                ruta_archivo=f"uploads/{unique_name}",
                nombre_archivo=original_name,
                avistamiento_id=avistamiento.id
            )
            db.session.add(reg)

        db.session.commit()
        flash("¡Avistamiento registrado con éxito!", "exito_avistamiento")
        return redirect(url_for('index'))
    
    return render_template('avistamiento.html', voluntarios=voluntarios, aves=aves)

@app.route('/consultar_avistamientos')
def consultar_avistamientos():
    tipo_ave = request.args.get('tipoAve', 'todos')
    orden = request.args.get('orden', 'fecha')
    orden_tipo = request.args.get('orden_tipo', 'asc')
    page = request.args.get('page', 1, type=int)

    query = Avistamiento.query

    if tipo_ave != 'todos' and tipo_ave:
        if tipo_ave.isdigit():
            query = query.filter_by(ave_id=int(tipo_ave))
        else:
            query = query.filter_by(ave_id=-1)

    columna_orden = Avistamiento.lugar if orden == 'lugar' else Avistamiento.fecha_hora

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

@app.route('/api/avistamiento/<int:avistamiento_id>/comentarios', methods=['GET'])
def obtener_comentarios(avistamiento_id):
    comentarios = Comentario.query.filter_by(avistamiento_id=avistamiento_id).order_by(Comentario.fecha.desc()).all()
    lista = [
        {
            'id': c.id,
            'nombre': c.nombre,
            'texto': c.texto,
            'fecha': c.fecha.strftime('%d/%m/%Y %H:%M')
        }
        for c in comentarios
    ]
    return jsonify(lista)

@app.route('/api/avistamiento/<int:avistamiento_id>/comentarios', methods=['POST'])
def agregar_comentario(avistamiento_id):
    data = request.get_json() or request.form
    nombre = (data.get('nombre') or '').strip()
    texto = (data.get('texto') or '').strip()

    # Validaciones del servidor
    errores = []
    if len(nombre) < 3 or len(nombre) > 50:
        errores.append("El nombre debe tener entre 3 y 50 caracteres.")
    if len(texto) < 5:
        errores.append("El texto del comentario debe tener al menos 5 caracteres.")

    if errores:
        return jsonify({'success': False, 'errores': errores}), 400

    nuevo_comentario = Comentario(
        nombre=nombre,
        texto=texto,
        avistamiento_id=avistamiento_id,
        fecha=datetime.now()
    )
    db.session.add(nuevo_comentario)
    db.session.commit()

    return jsonify({'success': True, 'mensaje': 'Comentario agregado con éxito.'})

@app.route('/api/estadisticas', methods=['GET'])
def api_estadisticas():
    # 1. Gráfico de líneas: Avistamientos por día
    avistamientos_por_dia = db.session.query(
        db.func.date(Avistamiento.fecha_hora).label('fecha'),
        db.func.count(Avistamiento.id).label('total')
    ).group_by(db.func.date(Avistamiento.fecha_hora)).order_by('fecha').all()

    dias_labels = [row.fecha.strftime('%d/%m/%Y') for row in avistamientos_por_dia]
    dias_values = [row.total for row in avistamientos_por_dia]

    # 2. Gráfico de torta: Total de avistamientos por tipo de ave
    avistamientos_por_ave = db.session.query(
        Ave.nombre,
        db.func.count(Avistamiento.id).label('total')
    ).join(Avistamiento, Ave.id == Avistamiento.ave_id)\
     .group_by(Ave.id).all()

    aves_labels = [row.nombre for row in avistamientos_por_ave]
    aves_values = [row.total for row in avistamientos_por_ave]

    # 3. Gráfico de barras: Total de voluntarios por comuna
    voluntarios_por_comuna = db.session.query(
        Comuna.nombre,
        db.func.count(Voluntario.id).label('total')
    ).join(Voluntario, Comuna.id == Voluntario.comuna_id)\
     .group_by(Comuna.id).all()

    comunas_labels = [row.nombre for row in voluntarios_por_comuna]
    comunas_values = [row.total for row in voluntarios_por_comuna]

    return jsonify({
        'lineas': {'labels': dias_labels, 'data': dias_values},
        'torta': {'labels': aves_labels, 'data': aves_values},
        'barras': {'labels': comunas_labels, 'data': comunas_values}
    })

if __name__ == '__main__':
    app.run(debug=True)