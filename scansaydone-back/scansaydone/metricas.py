"""Cálculo de métricas de satisfacción (por ahora, solo NPS)."""


def calcular_nps(ratings: list[int]) -> dict:
    """Calcula el NPS a partir de notas de 0 a 10.

    Fórmula: % Promotores (9-10) - % Detractores (0-6).
    Lanza `ValueError` si la lista está vacía o trae una nota fuera de 0..10.
    """
    if not ratings:
        raise ValueError("La lista de calificaciones no puede estar vacía.")

    for r in ratings:
        if r < 0 or r > 10:
            raise ValueError(f"Calificación inválida: {r}. Debe ser entre 0 y 10.")

    total = len(ratings)
    promoters = sum(1 for r in ratings if r >= 9)
    passives = sum(1 for r in ratings if 7 <= r <= 8)
    detractors = sum(1 for r in ratings if r <= 6)

    nps = ((promoters - detractors) / total) * 100

    if nps >= 50:
        category = "Excelente"
    elif nps >= 0:
        category = "Bueno"
    else:
        category = "Crítico / Necesita atención"

    return {
        "total_responses": total,
        "promoters": promoters,
        "passives": passives,
        "detractors": detractors,
        "nps_score": round(nps, 2),
        "category": category,
    }
