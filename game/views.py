from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Game
from .serializers import (
    GameIdSerializer,
    GameStateSerializer,
    GuessRequestSerializer,
    GuessResponseSerializer,
)


@api_view(['POST'])
def new_game(request):
    """Create a new hangman game."""
    game = Game.create_new_game()
    serializer = GameIdSerializer({'id': game.id})
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def game_state(request, game_id):
    """Get the current state of a game."""
    game = get_object_or_404(Game, id=game_id)
    state = game.get_state()
    serializer = GameStateSerializer(state)
    return Response(serializer.data)


@api_view(['POST'])
def make_guess(request, game_id):
    """Make a guess for a letter in the game."""
    game = get_object_or_404(Game, id=game_id)
    
    # Validate request
    request_serializer = GuessRequestSerializer(data=request.data)
    if not request_serializer.is_valid():
        return Response(
            request_serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    letter = request_serializer.validated_data['letter']
    
    # Validate letter is alphabetic
    if not letter.isalpha():
        return Response(
            {'error': 'Letter must be alphabetic.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Make the guess
    is_correct, error_message = game.make_guess(letter)
    
    if error_message:
        return Response(
            {'error': error_message},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Get updated game state
    state = game.get_state()
    
    # Prepare response
    response_data = {
        'correct': is_correct,
        **state
    }
    
    serializer = GuessResponseSerializer(response_data)
    return Response(serializer.data)
