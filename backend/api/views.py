import requests
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Usuario, PokemonUsuario

@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def register_user(request):
    try:
        print(f"[DEBUG] register_user called; method={request.method}; user={request.user}; auth={getattr(request, 'auth', None)}")
    except Exception:
        print("[DEBUG] register_user called - could not print request.user")

    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({'error': 'Usuário e senha obrigatórios.'}, status=status.HTTP_400_BAD_REQUEST)
    if Usuario.objects.filter(username=username).exists():
        return Response({'error': 'Usuário já existe.'}, status=status.HTTP_400_BAD_REQUEST)
    user = Usuario.objects.create_user(username=username, password=password)
    return Response({'message': 'Usuário criado com sucesso!'}, status=status.HTTP_201_CREATED)


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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """Allow an authenticated user to change their password by providing the current password and a new password."""
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')

    if not current_password or not new_password:
        return Response({"detail": "Parâmetros obrigatórios: current_password e new_password."}, status=status.HTTP_400_BAD_REQUEST)

    user = request.user
    if not user.check_password(current_password):
        return Response({"detail": "Senha atual incorreta."}, status=status.HTTP_400_BAD_REQUEST)

    # Opcional: validar força mínima da senha
    if len(new_password) < 6:
        return Response({"detail": "A nova senha deve ter pelo menos 6 caracteres."}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()
    return Response({"detail": "Senha alterada com sucesso."})
