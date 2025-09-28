from django.urls import path
from . import views

urlpatterns = [
    path('pokemon/<int:id>/', views.get_pokemon),
]
