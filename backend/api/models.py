from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):
    dt_inclusao = models.DateTimeField(auto_now_add=True)
    dt_alteracao = models.DateTimeField(auto_now=True)

class PokemonUsuario(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    codigo = models.CharField(max_length=50)
    nome = models.CharField(max_length=100)
    imagem_url = models.CharField(max_length=255)
    favorito = models.BooleanField(default=False)
    grupo_batalha = models.BooleanField(default=False)
