from scansaydone.catalogo import PREGUNTA_P1, PREGUNTA_P2


def test_encuesta_de_empresa(client, empresa_cafe):
    r = client.get(f"/api/v1/empresas/{empresa_cafe.empresa_id}/encuesta")

    assert r.status_code == 200
    assert r.json() == {
        "empresa_id": empresa_cafe.empresa_id,
        "nombre_negocio": "Café Rincón Andino",
        "rubro": "Cafetería / restaurante",
        "preguntas": {
            "p1": {"texto": PREGUNTA_P1, "escala": [0, 10]},
            "p2": {"texto": PREGUNTA_P2, "escala": [1, 5]},
            "p3": {
                "texto": "¿Cómo calificas el sabor y la calidad de lo que consumiste?",
                "etiqueta": "Calidad del producto",
                "escala": [1, 5],
            },
            "p4": {
                "texto": "¿Qué tan conforme quedaste con el tiempo que tardó en llegar tu pedido?",
                "etiqueta": "Tiempo de servicio",
                "escala": [1, 5],
            },
            "p5": {
                "texto": "¿Qué podríamos hacer para que tu próxima visita sea mejor?",
                "max_caracteres": 300,
            },
        },
    }


def test_encuesta_con_id_fuera_de_rango_da_422(client):
    assert client.get("/api/v1/empresas/2147483648/encuesta").status_code == 422
    assert client.get("/api/v1/empresas/0/encuesta").status_code == 422


def test_encuesta_empresa_inexistente_da_404(client):
    r = client.get("/api/v1/empresas/999/encuesta")
    assert r.status_code == 404
    assert r.json() == {"detail": "Empresa no encontrada."}
