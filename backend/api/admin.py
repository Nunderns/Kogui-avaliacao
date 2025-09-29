from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Usuario, PokemonUsuario


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    # Show useful fields in the list view
    list_display = (
        "username",
        "email",
        "first_name",
        "last_name",
        "is_staff",
        "dt_inclusao",
        "dt_alteracao",
    )
    search_fields = ("username", "email", "first_name", "last_name")
    ordering = ("username",)


@admin.register(PokemonUsuario)
class PokemonUsuarioAdmin(admin.ModelAdmin):
    list_display = ("id", "usuario", "codigo", "nome", "favorito", "grupo_batalha")
    list_filter = ("favorito", "grupo_batalha")
    search_fields = ("codigo", "nome", "usuario__username")

