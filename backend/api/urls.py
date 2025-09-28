from django.urls import path
from . import views

urlpatterns = [
    path('pokemon/<int:id>/', views.get_pokemon),
    path('favoritos/', views.list_favoritos),
    path('grupo-batalha/', views.list_grupo_batalha),
    path('favoritos/<int:pokemon_id>/', views.toggle_favorito),
    path('grupo-batalha/<int:pokemon_id>/', views.toggle_grupo),
    path('register/', views.register_user),
]
