import requests
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import PokemonUsuario


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pokemon(request, id):
    url = f"https://pokeapi.co/api/v2/pokemon/{id}"
    r = requests.get(url).json()
    return Response({
        "id": r["id"],
        "nome": r["name"],
        "imagem": r["sprites"]["front_default"],
        "tipos": [t["type"]["name"] for t in r["types"]]
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_favoritos(request):
    favs = PokemonUsuario.objects.filter(usuario=request.user, favorito=True)
    return Response([{"id": p.codigo, "nome": p.nome, "imagem": p.imagem_url} for p in favs])


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_grupo_batalha(request):
    grupo = PokemonUsuario.objects.filter(usuario=request.user, grupo_batalha=True)
    return Response([{"id": p.codigo, "nome": p.nome, "imagem": p.imagem_url} for p in grupo])


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_favorito(request, pokemon_id):
    pokemon, created = PokemonUsuario.objects.get_or_create(usuario=request.user, codigo=pokemon_id)
    if created:
        url = f"https://pokeapi.co/api/v2/pokemon/{pokemon_id}"
        r = requests.get(url).json()
        pokemon.nome = r["name"]
        pokemon.imagem_url = r["sprites"]["front_default"]
    pokemon.favorito = not pokemon.favorito
    pokemon.save()
    return Response({"favorito": pokemon.favorito})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_grupo(request, pokemon_id):
    grupo_count = PokemonUsuario.objects.filter(usuario=request.user, grupo_batalha=True).count()
    pokemon, created = PokemonUsuario.objects.get_or_create(usuario=request.user, codigo=pokemon_id)
    if created:
        url = f"https://pokeapi.co/api/v2/pokemon/{pokemon_id}"
        r = requests.get(url).json()
        pokemon.nome = r["name"]
        pokemon.imagem_url = r["sprites"]["front_default"]
    if not pokemon.grupo_batalha and grupo_count >= 6:
        return Response({"erro": "Máximo de 6 pokémons no grupo!"}, status=400)
    pokemon.grupo_batalha = not pokemon.grupo_batalha
    pokemon.save()
    return Response({"grupo_batalha": pokemon.grupo_batalha})
