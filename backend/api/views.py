from django.shortcuts import render
import requests
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view('GET')
@permission_classes(([IsAuthenticated]))
def get_pokemon(resquest, id):
    url = f"https://pokeapi.co/api/v2/pokemon/{id}"
    r = requests.get(url).json()
    return Response({
        "id": r["id"],
        "nome": r["name"],
        "imagem": r["sprites"]["front_default"],
        "tipos": [t["type"]["name"] for t in r["types"]]
    })