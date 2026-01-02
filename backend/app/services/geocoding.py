import httpx
from typing import Optional, Dict


async def reverse_geocode(latitude: float, longitude: float) -> Dict[str, Optional[str]]:
    """
    緯度経度から住所を取得する（逆ジオコーディング）
    OpenStreetMap Nominatimを使用
    """
    url = "https://nominatim.openstreetmap.org/reverse"
    params = {
        "lat": latitude,
        "lon": longitude,
        "format": "json",
        "addressdetails": 1,
        "accept-language": "ja"
    }
    headers = {
        "User-Agent": "LocationTrackerApp/1.0"
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, headers=headers)
            response.raise_for_status()
            data = response.json()

            address = data.get("address", {})

            # 日本の住所構造を考慮
            prefecture = (
                address.get("province") or
                address.get("state") or
                address.get("region") or
                None
            )

            city = (
                address.get("city") or
                address.get("town") or
                address.get("village") or
                address.get("municipality") or
                None
            )

            # 詳細住所
            address_parts = []
            if address.get("suburb"):
                address_parts.append(address.get("suburb"))
            if address.get("neighbourhood"):
                address_parts.append(address.get("neighbourhood"))
            if address.get("road"):
                address_parts.append(address.get("road"))

            address_detail = "".join(address_parts) if address_parts else None

            return {
                "prefecture": prefecture,
                "city": city,
                "address_detail": address_detail
            }

    except Exception as e:
        print(f"Geocoding error: {e}")
        return {
            "prefecture": None,
            "city": None,
            "address_detail": None
        }
