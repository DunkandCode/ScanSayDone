import pandas as pd
import numpy as np

# -----------------------------------------------------------------------------
# 1. METADATA Y CONFIGURACIÓN DE RUBROS
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
# 2. MOTOR NLP Y CLASIFICACIÓN DE COMENTARIOS (P5)
# -----------------------------------------------------------------------------
# NOTA: esta lógica está copiada en scansaydone-back/scansaydone/nlp.py (backend FastAPI).
# Si cambias las palabras clave o su orden de prioridad, aplica el cambio en AMBOS archivos.
def clasificar_comentario_nlp(texto: str) -> str:
    """Clasifica el comentario abierto P5 según intención/sentimiento mediante léxico."""
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
# 3. PIPELINE DE INGESTA Y ENGENIERÍA DE CARACTERÍSTICAS TEMPORALES
# -----------------------------------------------------------------------------
def procesar_encuestas_completas(df_crudo: pd.DataFrame) -> pd.DataFrame:
    """Procesa el conjunto de datos adicionando características temporales, de atributos y reglas."""
    df = df_crudo.copy()

    # A. Ingeniería Temporal (Fecha y Hora)
    if 'Fecha' in df.columns:
        fecha_dt = pd.to_datetime(df['Fecha'])
        df['Año'] = fecha_dt.dt.year
        df['Mes'] = fecha_dt.dt.strftime('%B')
        df['Mes_Num'] = fecha_dt.dt.month
        df['Semana_Año'] = fecha_dt.dt.isocalendar().week  # Identificador de Semana
        
        dias_espanol = {
            'Monday': 'Lunes', 'Tuesday': 'Martes', 'Wednesday': 'Miércoles',
            'Thursday': 'Jueves', 'Friday': 'Viernes', 'Saturday': 'Sábado', 'Sunday': 'Domingo'
        }
        df['Dia_Semana'] = fecha_dt.dt.day_name().map(dias_espanol)

    if 'Hora' in df.columns:
        def extraer_hora_entera(val):
            if isinstance(val, str):
                return int(val.split(':')[0])
            elif hasattr(val, 'hour'):
                return val.hour
            return pd.to_datetime(str(val)).hour

        df['Hora_Num'] = df['Hora'].apply(extraer_hora_entera)

        # Regla de Negocio para Bloques Horarios
        # Mañana: 06:00 - 11:59 | Tarde: 12:00 - 19:59 | Noche: 20:00 - 05:59
        condiciones_bloque = [
            (df['Hora_Num'] >= 6) & (df['Hora_Num'] < 12),
            (df['Hora_Num'] >= 12) & (df['Hora_Num'] < 20)
        ]
        df['Bloque_Horario'] = np.select(condiciones_bloque, ['Mañana', 'Tarde'], default='Noche')

    # B. Metadata y Variables Derivadas
    df['Atributo P3'] = df['Rubro'].map(lambda r: METADATA_RUBROS.get(r, {}).get('P3_label', 'Atributo 1'))
    df['Atributo P4'] = df['Rubro'].map(lambda r: METADATA_RUBROS.get(r, {}).get('P4_label', 'Atributo 2'))

    p1 = df['P1. Probabilidad de recomendar (0-10)']
    p2 = df['P2. Satisfacción global (1-5)']
    
    cond_nps = [p1 >= 9, p1.between(7, 8), p1 <= 6]
    df['Categoría NPS'] = np.select(cond_nps, ['Promotor', 'Pasivo', 'Detractor'], default='Indefinido')

    # Alertas automáticas (P1 <= 6 o P2 <= 2)
    df['Alerta'] = np.where((p1 <= 6) | (p2 <= 2), 'ALERTA', '')

    if 'P5. Comentario (opcional)' in df.columns:
        df['Tipo de comentario'] = df['P5. Comentario (opcional)'].apply(clasificar_comentario_nlp)

    return df

# -----------------------------------------------------------------------------
# 4. MOTOR ESTADÍSTICO DE CÁLCULO DE MÉTRICAS (NPS, CSAT, ATRIBUTOS, NLP)
# -----------------------------------------------------------------------------
def calcular_metricas_satisfaccion(df: pd.DataFrame, grupo_cols: list = ['Rubro']) -> pd.DataFrame:
    """
    Calcula dinámicamente NPS, CSAT (% 4 y 5), Promedios y TopBox % de Atributos P3/P4,
    conteo de Alertas y desglose de comentarios agrupando por las columnas especificadas.
    """
    resultados = []
    
    for keys, g in df.groupby(grupo_cols):
        if not isinstance(keys, tuple):
            keys = (keys,)
        
        n = len(g)
        promotores = (g['Categoría NPS'] == 'Promotor').sum()
        pasivos = (g['Categoría NPS'] == 'Pasivo').sum()
        detractores = (g['Categoría NPS'] == 'Detractor').sum()
        
        # 1. Fórmula NPS = % Promotores - % Detractores
        pct_prom = (promotores / n) * 100 if n > 0 else 0
        pct_det = (detractores / n) * 100 if n > 0 else 0
        nps_score = round(pct_prom - pct_det, 1)
        
        # 2. Fórmula CSAT = (Respuestas 4 y 5 ÷ Total) * 100
        csat_satisfechos = (g['P2. Satisfacción global (1-5)'].isin([4, 5])).sum()
        csat_pct = round((csat_satisfechos / n) * 100, 1) if n > 0 else 0
        
        # 3. Métricas Atributo P3
        p3 = g['P3. Atributo 1 (1-5)']
        p3_promedio = round(p3.mean(), 2) if n > 0 else 0
        p3_topbox_pct = round(((p3.isin([4, 5])).sum() / n) * 100, 1) if n > 0 else 0
        
        # 4. Métricas Atributo P4
        p4 = g['P4. Atributo 2 (1-5)']
        p4_promedio = round(p4.mean(), 2) if n > 0 else 0
        p4_topbox_pct = round(((p4.isin([4, 5])).sum() / n) * 100, 1) if n > 0 else 0
        
        # 5. Alertas y Clasificación de Comentarios
        num_alertas = (g['Alerta'] == 'ALERTA').sum()
        num_reclamos = (g['Tipo de comentario'] == 'Reclamo').sum()
        num_felicitaciones = (g['Tipo de comentario'] == 'Felicitación').sum()
        num_sugerencias = (g['Tipo de comentario'] == 'Sugerencia / mixto').sum()
        num_sin_comentario = (g['Tipo de comentario'] == 'Sin comentario').sum()

        res_dict = dict(zip(grupo_cols, keys))
        res_dict.update({
            'n (Muestra)': n,
            'NPS Score': nps_score,
            'CSAT (%)': csat_pct,
            'Promotores': promotores,
            'Pasivos': pasivos,
            'Detractores': detractores,
            'Atributo P3': g['Atributo P3'].iloc[0],
            'P3 (Promedio)': p3_promedio,
            'P3 TopBox (%)': p3_topbox_pct,
            'Atributo P4': g['Atributo P4'].iloc[0],
            'P4 (Promedio)': p4_promedio,
            'P4 TopBox (%)': p4_topbox_pct,
            'Alertas Activas': num_alertas,
            'Felicitaciones': num_felicitaciones,
            'Reclamos': num_reclamos,
            'Sugerencias': num_sugerencias,
            'Sin Comentario': num_sin_comentario
        })
        resultados.append(res_dict)
        
    return pd.DataFrame(resultados)

# --- EJECUCIÓN CON DATOS REALES ---
if __name__ == "__main__":
    filepath = 'Simulacion_80_Encuestas_Scan_Say_Done_OpinaYa.xlsx'
    df_raw = pd.read_excel(filepath, sheet_name='Datos_encuesta')
    
    # 1. Pipeline de Ingesta
    df_procesado = procesar_encuestas_completas(df_raw)
    
    # 2. Métricas Consolidadas por Rubro
    print("\n=================== 1. MÉTRICAS GENERALES POR RUBRO ===================")
    df_rubro = calcular_metricas_satisfaccion(df_procesado, grupo_cols=['Rubro'])
    print(df_rubro[['Rubro', 'n (Muestra)', 'NPS Score', 'CSAT (%)', 'P3 (Promedio)', 'P4 (Promedio)', 'Alertas Activas']].to_string(index=False))

    # 3. Métricas Desagregadas por Rubro, Semana y Bloque Horario
    print("\n=================== 2. ANÁLISIS TEMPORAL (RUBRO + BLOQUE HORARIO) ===================")
    df_bloques = calcular_metricas_satisfaccion(df_procesado, grupo_cols=['Rubro', 'Bloque_Horario'])
    print(df_bloques[['Rubro', 'Bloque_Horario', 'n (Muestra)', 'NPS Score', 'CSAT (%)', 'P3 (Promedio)', 'P4 (Promedio)']].head(10).to_string(index=False))