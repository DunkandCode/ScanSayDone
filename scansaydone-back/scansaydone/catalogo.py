"""Catálogo de preguntas por rubro.

Fuente: docs/datos/metodologia/cuestionarios_nps_por_rubro.docx y la hoja «Preguntas por
rubro» de docs/datos/datasets/simulacion_80_encuestas.xlsx (textos sin el sufijo de escala).
Las etiquetas P3/P4 coinciden con `dim_rubros` del ERD y con METADATA_RUBROS del pipeline.
"""

# P1 y P2 son comunes a todos los rubros.
PREGUNTA_P1 = "¿Qué tan probable es que recomiendes el negocio a un amigo o familiar?"
PREGUNTA_P2 = "En general, ¿qué tan satisfecho/a quedaste?"

RUBROS = [
    {
        "rubro_id": 1,
        "nombre": "Minimarket / almacén de barrio",
        "p3_label": "Surtido y disponibilidad",
        "p4_label": "Calidad de la atención",
        "p3_pregunta": "¿Qué tan fácil fue encontrar los productos que buscabas?",
        "p4_pregunta": "¿Cómo calificas la amabilidad y disposición de quien te atendió?",
        "p5_pregunta": "¿Qué es lo primero que cambiarías o mejorarías en nuestro local?",
    },
    {
        "rubro_id": 2,
        "nombre": "Cafetería / restaurante",
        "p3_label": "Calidad del producto",
        "p4_label": "Tiempo de servicio",
        "p3_pregunta": "¿Cómo calificas el sabor y la calidad de lo que consumiste?",
        "p4_pregunta": "¿Qué tan conforme quedaste con el tiempo que tardó en llegar tu pedido?",
        "p5_pregunta": "¿Qué podríamos hacer para que tu próxima visita sea mejor?",
    },
    {
        "rubro_id": 3,
        "nombre": "Peluquería / centro de estética",
        "p3_label": "Calidad técnica del servicio",
        "p4_label": "Comunicación y personalización",
        "p3_pregunta": "¿Qué tan conforme estás con el resultado final de tu servicio?",
        "p4_pregunta": "¿Qué tanto sentiste que el profesional entendió lo que querías?",
        "p5_pregunta": "¿Qué podríamos mejorar en tu próxima visita?",
    },
    {
        "rubro_id": 4,
        "nombre": "Emprendimiento de venta online",
        "p3_label": "Calidad y expectativa del producto",
        "p4_label": "Cumplimiento logístico",
        "p3_pregunta": "¿Qué tanto coincidió el producto que recibiste con lo que esperabas (descripción y fotos)?",
        "p4_pregunta": "¿Cómo calificas el cumplimiento del plazo de entrega que te prometimos?",
        "p5_pregunta": "¿Qué podríamos mejorar en tu experiencia de compra?",
    },
]
