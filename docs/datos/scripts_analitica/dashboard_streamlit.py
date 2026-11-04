import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px

# -----------------------------------------------------------------------------
# 1. CONFIGURACIÓN DE LA PÁGINA (STREAMLIT UX)
# -----------------------------------------------------------------------------
st.set_page_config(
    page_title="OpinaYa | Dashboard de Satisfacción",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Estilos CSS personalizados
st.markdown("""
    <style>
    .metric-card {
        background-color: #1E222D;
        padding: 18px;
        border-radius: 10px;
        border: 1px solid #2B313E;
        text-align: center;
    }
    .metric-title { color: #A0AAB8; font-size: 14px; font-weight: 500; }
    .metric-value { font-size: 28px; font-weight: bold; margin-top: 5px; }
    </style>
""", unsafe_allow_html=True)

# -----------------------------------------------------------------------------
# 2. DICCIONARIO DE METADATA (Mapeo de Atributos P3 y P4 por Rubro)
# -----------------------------------------------------------------------------
METADATA_RUBROS = {
    'Minimarket / almacén de barrio': {
        'P3_label': 'Surtido y disponibilidad',
        'P4_label': 'Calidad de la atención'
    },
    'Cafetería / restaurante': {
        'P3_label': 'Calidad del producto',
        'P4_label': 'Tiempo de servicio'
    },
    'Peluquería / centro de estética': {
        'P3_label': 'Calidad técnica del servicio',
        'P4_label': 'Comunicación y personalización'
    },
    'Emprendimiento de venta online': {
        'P3_label': 'Calidad y expectativa del producto',
        'P4_label': 'Cumplimiento logístico'
    }
}

# -----------------------------------------------------------------------------
# 3. CLASIFICACIÓN NLP DE COMENTARIOS (P5)
# -----------------------------------------------------------------------------
def clasificar_comentario_nlp(texto: str) -> str:
    """Clasifica el comentario abierto P5 mediante un léxico enriquecido."""
    if pd.isna(texto) or str(texto).strip() == "":
        return "Sin comentario"
    
    texto_clean = str(texto).lower()
    
    keywords_reclamo = [
        "malo", "mala", "demorado", "demoraron", "espera", "frío", "defecto", "tardaron", "tarde", 
        "seco", "duro", "inferior", "mala calidad", "mala atención", "no entendieron", "aguado", 
        "no quedé conforme", "claro", "tardó", "disconforme", "disparejo", "demoró", "demora", 
        "demorar", "vencidos", "faltaron", "acaba", "ruidoso", "desorden", "desordenado", "distinto", 
        "no era", "sin sabor", "varias veces"
    ]
    keywords_felicitacion = [
        "excelente", "me encantó", "encantó", "mejor", "mejores", "recomendado", "recomendados", 
        "super", "súper", "delicioso", "perfecto", "gracias", "feliz", "rápidos", "amables", 
        "buena", "agradable", "felicitacion", "felicitaciones", "felicitar", "entendieron", 
        "contenta", "acogedor", "satisfecho", "satisfechos", "rico", "buen", "agradecí"
    ]
    keywords_sugerencia = [
        "podrían", "ojalá", "agregar", "cambiar", "opciones", "variedad", "más", "falta"
    ]

    if any(kw in texto_clean for kw in keywords_reclamo):
        return "Reclamo"
    elif any(kw in texto_clean for kw in keywords_sugerencia):
        return "Sugerencia / mixto"
    elif any(kw in texto_clean for kw in keywords_felicitacion):
        return "Felicitación"
    else:
        return "Sugerencia / mixto"

# -----------------------------------------------------------------------------
# 4. PIPELINE DE INGESTA Y ENGENIERÍA DE CARACTERÍSTICAS
# -----------------------------------------------------------------------------
@st.cache_data
def cargar_y_procesar_datos(filepath: str):
    """Carga los datos crudos y genera todas las variables derivadas (temporales, atributos, NPS, NLP)."""
    df = pd.read_excel(filepath, sheet_name='Datos_encuesta')
    
    # Estandarización de nombres de columnas
    col_map = {
        'P1. Probabilidad de recomendar (0-10)': 'P1',
        'P2. Satisfacción global (1-5)': 'P2',
        'P3. Atributo 1 (1-5)': 'P3',
        'P4. Atributo 2 (1-5)': 'P4',
        'P5. Comentario (opcional)': 'P5',
        'Negocio (simulado)': 'Negocio'
    }
    df = df.rename(columns={k: v for k, v in col_map.items() if k in df.columns})
    
    # 1. Variables Temporales Derivadas (Fecha y Hora)
    if 'Fecha' in df.columns:
        fecha_dt = pd.to_datetime(df['Fecha'])
        df['Año'] = fecha_dt.dt.year
        df['Semana_Año'] = fecha_dt.dt.isocalendar().week
        
        meses_espanol = {
            1: 'Enero', 2: 'Febrero', 3: 'Marzo', 4: 'Abril', 5: 'Mayo', 6: 'Junio',
            7: 'Julio', 8: 'Agosto', 9: 'Septiembre', 10: 'Octubre', 11: 'Noviembre', 12: 'Diciembre'
        }
        df['Mes'] = fecha_dt.dt.month.map(meses_espanol)
        df['Mes_Num'] = fecha_dt.dt.month
        
        dias_espanol = {
            'Monday': 'Lunes', 'Tuesday': 'Martes', 'Wednesday': 'Miércoles',
            'Thursday': 'Jueves', 'Friday': 'Viernes', 'Saturday': 'Sábado', 'Sunday': 'Domingo'
        }
        df['Dia_Semana'] = fecha_dt.dt.day_name().map(dias_espanol)

    if 'Hora' in df.columns:
        def extraer_hora(val):
            if isinstance(val, str):
                return int(val.split(':')[0])
            elif hasattr(val, 'hour'):
                return val.hour
            return pd.to_datetime(str(val)).hour

        df['Hora_Num'] = df['Hora'].apply(extraer_hora)
        condiciones_bloque = [
            (df['Hora_Num'] >= 6) & (df['Hora_Num'] < 12),
            (df['Hora_Num'] >= 12) & (df['Hora_Num'] < 20)
        ]
        df['Bloque_Horario'] = np.select(condiciones_bloque, ['Mañana', 'Tarde'], default='Noche')
    
    # 2. Atributos dinámicos P3 y P4 según Rubro
    df['Atributo P3'] = df['Rubro'].map(lambda r: METADATA_RUBROS.get(r, {}).get('P3_label', 'Atributo 1'))
    df['Atributo P4'] = df['Rubro'].map(lambda r: METADATA_RUBROS.get(r, {}).get('P4_label', 'Atributo 2'))
    
    # 3. Categoría NPS (=IF(P1>=9,"Promotor",IF(P1>=7,"Pasivo","Detractor")))
    condiciones_nps = [df['P1'] >= 9, df['P1'].between(7, 8), df['P1'] <= 6]
    df['Categoría NPS'] = np.select(condiciones_nps, ['Promotor', 'Pasivo', 'Detractor'], default='Indefinido')
    
    # 4. Regla de Alerta (=IF(OR(P1<=6, P2<=2), "ALERTA", ""))
    df['Alerta'] = np.where((df['P1'] <= 6) | (df['P2'] <= 2), 'ALERTA', '')
    
    # 5. Clasificación NLP del comentario P5
    if 'P5' in df.columns:
        df['Tipo de comentario'] = df['P5'].apply(clasificar_comentario_nlp)
    
    return df

# Carga de datos
archivo = 'Simulacion_80_Encuestas_Scan_Say_Done_OpinaYa.xlsx'
try:
    df_data = cargar_y_procesar_datos(archivo)
except Exception as e:
    st.error(f"Error al cargar el archivo de encuestas: {e}")
    st.stop()

# -----------------------------------------------------------------------------
# 5. BARRA LATERAL (FILTROS MULTIDIMENSIONALES: NAVEGACIÓN Y TIEMPO)
# -----------------------------------------------------------------------------
st.sidebar.title("OpinaYa Dashboard")
st.sidebar.markdown("**Escucha antes del reclamo**")
st.sidebar.divider()

modo_vista = st.sidebar.radio("Modo de Análisis", ["Por Empresa / Negocio", "Comparativa por Rubro"])

st.sidebar.subheader("Filtros Temporales")

# Filtro por Semana del Año
semanas_disponibles = ["Todas"] + sorted(df_data['Semana_Año'].unique().tolist())
semana_sel = st.sidebar.selectbox("Semana del Año", semanas_disponibles)

# Filtro por Día de la Semana
dias_disponibles = ["Todos"] + df_data['Dia_Semana'].unique().tolist()
dia_sel = st.sidebar.selectbox("Día de la Semana", dias_disponibles)

# Filtro por Bloque Horario
bloques_disponibles = ["Todos"] + df_data['Bloque_Horario'].unique().tolist()
bloque_sel = st.sidebar.selectbox("Bloque Horario", bloques_disponibles)

# Aplicar Filtros Temporales a los Datos
df_filtrado_temp = df_data.copy()
if semana_sel != "Todas":
    df_filtrado_temp = df_filtrado_temp[df_filtrado_temp['Semana_Año'] == semana_sel]
if dia_sel != "Todos":
    df_filtrado_temp = df_filtrado_temp[df_filtrado_temp['Dia_Semana'] == dia_sel]
if bloque_sel != "Todos":
    df_filtrado_temp = df_filtrado_temp[df_filtrado_temp['Bloque_Horario'] == bloque_sel]

if modo_vista == "Por Empresa / Negocio":
    lista_empresas = df_filtrado_temp['Negocio'].unique().tolist()
    if not lista_empresas:
        st.warning("No hay datos para la combinación de filtros seleccionada.")
        st.stop()
    empresa_sel = st.sidebar.selectbox("Selecciona una Empresa / Negocio:", lista_empresas)
    df_final = df_filtrado_temp[df_filtrado_temp['Negocio'] == empresa_sel]
    rubro_actual = df_final['Rubro'].iloc[0]
    label_p3 = METADATA_RUBROS.get(rubro_actual, {}).get('P3_label', 'Atributo 1')
    label_p4 = METADATA_RUBROS.get(rubro_actual, {}).get('P4_label', 'Atributo 2')
else:
    lista_rubros = df_filtrado_temp['Rubro'].unique().tolist()
    rubro_sel = st.sidebar.selectbox("Selecciona un Rubro:", ["Todos los Rubros"] + lista_rubros)
    if rubro_sel == "Todos los Rubros":
        df_final = df_filtrado_temp
    else:
        df_final = df_filtrado_temp[df_filtrado_temp['Rubro'] == rubro_sel]

st.sidebar.divider()
st.sidebar.caption(f"Total encuestas analizadas: **n = {len(df_final)}**")
if len(df_final) < 30 and len(df_final) > 0:
    st.sidebar.warning("⚠️ Muestra n < 30: El NPS debe leerse como referencia.")

# -----------------------------------------------------------------------------
# 6. VISTA 1: DASHBOARD POR EMPRESA / NEGOCIO
# -----------------------------------------------------------------------------
if modo_vista == "Por Empresa / Negocio":
    st.title(f"📌 {empresa_sel}")
    st.caption(f"Rubro: **{rubro_actual}** | Medición de Satisfacción en Tiempo Real")
    st.divider()

    n_total = len(df_final)
    n_prom = (df_final['Categoría NPS'] == 'Promotor').sum()
    n_pas = (df_final['Categoría NPS'] == 'Pasivo').sum()
    n_det = (df_final['Categoría NPS'] == 'Detractor').sum()
    
    nps_score = round(((n_prom - n_det) / n_total) * 100, 1) if n_total > 0 else 0
    csat_pct = round(((df_final['P2'] >= 4).sum() / n_total) * 100, 1) if n_total > 0 else 0
    num_alertas = (df_final['Alerta'] == 'ALERTA').sum()
    
    prom_p3 = round(df_final['P3'].mean(), 2) if n_total > 0 else 0
    topbox_p3 = round(((df_final['P3'] >= 4).sum() / n_total) * 100, 1) if n_total > 0 else 0
    
    prom_p4 = round(df_final['P4'].mean(), 2) if n_total > 0 else 0
    topbox_p4 = round(((df_final['P4'] >= 4).sum() / n_total) * 100, 1) if n_total > 0 else 0

    # 1. TARJETAS DE KPIS PRINCIPALES
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        color_nps = "#00CC96" if nps_score >= 30 else ("#FFA15A" if nps_score >= 0 else "#FF6692")
        st.markdown(f"""
            <div class="metric-card">
                <div class="metric-title">NPS SCORE</div>
                <div class="metric-value" style="color: {color_nps};">{nps_score:+.1f}</div>
                <small>Promotores: {n_prom} | Detractores: {n_det}</small>
            </div>
        """, unsafe_allow_html=True)
        
    with col2:
        st.markdown(f"""
            <div class="metric-card">
                <div class="metric-title">CSAT (% Satisfacción P2)</div>
                <div class="metric-value" style="color: #636EFA;">{csat_pct}%</div>
                <small>Calificaciones 4 y 5 en P2</small>
            </div>
        """, unsafe_allow_html=True)

    with col3:
        st.markdown(f"""
            <div class="metric-card">
                <div class="metric-title">DIAGNÓSTICO ATRIBUTOS</div>
                <div class="metric-value" style="color: #AB63FA;">{round((prom_p3 + prom_p4)/2, 2)} / 5.0</div>
                <small>Promedio global de P3 y P4</small>
            </div>
        """, unsafe_allow_html=True)

    with col4:
        color_alt = "#FF4B4B" if num_alertas > 0 else "#00CC96"
        st.markdown(f"""
            <div class="metric-card">
                <div class="metric-title">ALERTAS ACTIVAS</div>
                <div class="metric-value" style="color: {color_alt};">{num_alertas}</div>
                <small>Encuestas con P1 ≤ 6 o P2 ≤ 2</small>
            </div>
        """, unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)

    # 2. GRÁFICOS E INSIGHTS DIAGNÓSTICOS
    col_left, col_right = st.columns(2)

    with col_left:
        st.subheader("📊 Distribución NPS (P1)")
        df_nps = pd.DataFrame({
            'Categoría': ['Promotores (9-10)', 'Pasivos (7-8)', 'Detractores (0-6)'],
            'Cantidad': [n_prom, n_pas, n_det]
        })
        fig_nps = px.bar(
            df_nps, x='Cantidad', y='Categoría', orientation='h', text='Cantidad',
            color='Categoría', color_discrete_map={
                'Promotores (9-10)': '#00CC96',
                'Pasivos (7-8)': '#FFA15A',
                'Detractores (0-6)': '#FF6692'
            }
        )
        fig_nps.update_layout(showlegend=False, height=300, margin=dict(l=10, r=10, t=10, b=10))
        st.plotly_chart(fig_nps, use_container_width=True)

    with col_right:
        st.subheader("🎯 Atributos Clave (P3 y P4)")
        df_atrib = pd.DataFrame({
            'Atributo': [f"{label_p3} (P3)", f"{label_p4} (P4)"],
            'Promedio (1-5)': [prom_p3, prom_p4],
            '% Top Box (4 y 5)': [topbox_p3, topbox_p4]
        })
        fig_atrib = px.bar(
            df_atrib, x='Promedio (1-5)', y='Atributo', orientation='h', text='Promedio (1-5)',
            color='Promedio (1-5)', color_continuous_scale='Blues', range_x=[1, 5]
        )
        fig_atrib.update_layout(coloraxis_showscale=False, height=300, margin=dict(l=10, r=10, t=10, b=10))
        st.plotly_chart(fig_atrib, use_container_width=True)

    st.divider()

    # 3. ANÁLISIS CRUZADO TEMPORAL
    col_t1, col_t2 = st.columns(2)

    with col_t1:
        st.subheader("📈 Evolución Diaria del NPS")
        df_tiempo = df_final.groupby('Fecha').apply(lambda g: pd.Series({
            'NPS': round((((g['Categoría NPS'] == 'Promotor').sum() - (g['Categoría NPS'] == 'Detractor').sum()) / len(g)) * 100, 1),
            'Respuestas': len(g)
        })).reset_index()
        fig_line = px.line(df_tiempo, x='Fecha', y='NPS', markers=True, title="Tendencia de NPS")
        fig_line.update_traces(line_color='#00CC96', line_width=3)
        st.plotly_chart(fig_line, use_container_width=True)

    with col_t2:
        st.subheader("⏰ Desempeño por Bloque Horario")
        df_bloque_graph = df_final.groupby('Bloque_Horario').apply(lambda g: pd.Series({
            'NPS': round((((g['Categoría NPS'] == 'Promotor').sum() - (g['Categoría NPS'] == 'Detractor').sum()) / len(g)) * 100, 1),
            'CSAT (%)': round(((g['P2'] >= 4).sum() / len(g)) * 100, 1),
            'Muestra': len(g)
        })).reset_index()
        fig_bloque = px.bar(df_bloque_graph, x='Bloque_Horario', y=['NPS', 'CSAT (%)'], barmode='group')
        st.plotly_chart(fig_bloque, use_container_width=True)

    st.divider()

    # 4. FEED DE ALERTAS Y ANÁLISIS DE COMENTARIOS (P5)
    st.subheader("🚨 Feed de Alertas y Comentarios (P5)")
    filtro_alerta = st.checkbox("Mostrar únicamente encuestas con ALERTA activa", value=False)
    
    df_tabla = df_final.copy()
    if filtro_alerta:
        df_tabla = df_tabla[df_tabla['Alerta'] == 'ALERTA']
        
    cols_mostrar = ['ID', 'Fecha', 'Hora', 'Dia_Semana', 'Bloque_Horario', 'P1', 'P2', 'P3', 'P4', 'P5', 'Tipo de comentario', 'Alerta']
    cols_existentes = [c for c in cols_mostrar if c in df_tabla.columns]
    
    st.dataframe(
        df_tabla[cols_existentes].sort_values(by=['Alerta', 'ID'], ascending=[False, True]),
        use_container_width=True,
        hide_index=True,
        column_config={
            "P1": st.column_config.NumberColumn("P1 (NPS)", format="%d"),
            "P2": st.column_config.NumberColumn("P2 (CSAT)", format="%d"),
            "P5": st.column_config.TextColumn("Comentario (P5)", width="large"),
            "Alerta": st.column_config.TextColumn("Estado Alerta")
        }
    )

# -----------------------------------------------------------------------------
# 7. VISTA 2: COMPARATIVA BENCHMARK POR RUBRO
# -----------------------------------------------------------------------------
else:
    st.title("📊 Comparativa Benchmark por Rubro")
    st.caption("Resumen consolidado agrupando métricas por categoría comercial")
    st.divider()

    resumen_rubros = df_final.groupby('Rubro').apply(lambda g: pd.Series({
        'n (Respuestas)': len(g),
        'Promotores': (g['Categoría NPS'] == 'Promotor').sum(),
        'Detractores': (g['Categoría NPS'] == 'Detractor').sum(),
        'NPS Score': round((((g['Categoría NPS'] == 'Promotor').sum() - (g['Categoría NPS'] == 'Detractor').sum()) / len(g)) * 100, 1),
        'CSAT Global (%)': round(((g['P2'] >= 4).sum() / len(g)) * 100, 1),
        'Promedio P3': round(g['P3'].mean(), 2),
        'Promedio P4': round(g['P4'].mean(), 2),
        'Alertas Activas': (g['Alerta'] == 'ALERTA').sum(),
        'Reclamos': (g['Tipo de comentario'] == 'Reclamo').sum()
    })).reset_index()

    st.dataframe(resumen_rubros, use_container_width=True, hide_index=True)

    col_g1, col_g2 = st.columns(2)
    with col_g1:
        st.subheader("NPS Score por Rubro")
        fig_comp_nps = px.bar(resumen_rubros, x='Rubro', y='NPS Score', color='NPS Score', color_continuous_scale='Greens')
        st.plotly_chart(fig_comp_nps, use_container_width=True)

    with col_g2:
        st.subheader("CSAT (%) por Rubro")
        fig_comp_csat = px.bar(resumen_rubros, x='Rubro', y='CSAT Global (%)', color='CSAT Global (%)', color_continuous_scale='Purples')
        st.plotly_chart(fig_comp_csat, use_container_width=True)
