import io

import qrcode
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import Response

router = APIRouter()


@router.get("/api/v1/qr/generate", tags=["QR"])
def generate_qr(
    target_url: str = Query(..., description="URL de destino a codificar en el QR"),
    box_size: int = Query(10, ge=1, le=50, description="Tamaño de los bloques del QR"),
    border: int = Query(4, ge=1, le=10, description="Grosor del borde blanco"),
):
    """
    Genera una imagen PNG con el código QR para el local comercial.
    """
    try:
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=box_size,
            border=border,
        )
        qr.add_data(target_url)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")
        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        buffer.seek(0)

        return Response(content=buffer.getvalue(), media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generando código QR: {str(e)}")
