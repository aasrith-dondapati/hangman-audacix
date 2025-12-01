from rest_framework import serializers
from .models import Game


class GameStateSerializer(serializers.Serializer):
    """Serializer for game state response."""
    status = serializers.CharField()
    word_state = serializers.CharField()
    incorrect_guesses_made = serializers.IntegerField()
    incorrect_guesses_remaining = serializers.IntegerField()


class GameIdSerializer(serializers.Serializer):
    """Serializer for new game response."""
    id = serializers.IntegerField()


class GuessRequestSerializer(serializers.Serializer):
    """Serializer for guess request."""
    letter = serializers.CharField(max_length=1, min_length=1)


class GuessResponseSerializer(serializers.Serializer):
    """Serializer for guess response."""
    correct = serializers.BooleanField()
    status = serializers.CharField()
    word_state = serializers.CharField()
    incorrect_guesses_made = serializers.IntegerField()
    incorrect_guesses_remaining = serializers.IntegerField()

