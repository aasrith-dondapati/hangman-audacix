from django.urls import path
from . import views

urlpatterns = [
    path('new', views.new_game, name='new_game'),
    path('<int:game_id>', views.game_state, name='game_state'),
    path('<int:game_id>/guess', views.make_guess, name='make_guess'),
]

