import math
import random
from django.db import models


class Game(models.Model):
    """Model to store hangman game state."""
    
    STATUS_CHOICES = [
        ('InProgress', 'InProgress'),
        ('Won', 'Won'),
        ('Lost', 'Lost'),
    ]
    
    # Available words for the game
    WORDS = ["Hangman", "Python", "Audacix", "Bottle", "Pen"]
    
    word = models.CharField(max_length=50)
    guessed_letters = models.CharField(max_length=26, default='', blank=True)
    incorrect_guesses = models.IntegerField(default=0)
    max_incorrect_guesses = models.IntegerField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='InProgress')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    @classmethod
    def create_new_game(cls):
        """Create a new game with a random word."""
        word = random.choice(cls.WORDS)
        max_incorrect = math.ceil(len(word) / 2)
        return cls.objects.create(
            word=word,
            max_incorrect_guesses=max_incorrect
        )
    
    def get_word_state(self):
        """Return the current state of the word with underscores for unguessed letters."""
        result = []
        for char in self.word:
            if char.lower() in self.guessed_letters.lower():
                result.append(char)
            else:
                result.append('_')
        return ''.join(result)
    
    def make_guess(self, letter):
        """Process a letter guess and update game state."""
        if self.status != 'InProgress':
            return False, "Game is already finished."
        
        letter = letter.lower()
        
        # Check if letter was already guessed
        if letter in self.guessed_letters.lower():
            return False, "Letter already guessed."
        
        # Add letter to guessed letters
        self.guessed_letters += letter
        
        # Check if letter is in the word
        is_correct = letter in self.word.lower()
        
        if not is_correct:
            self.incorrect_guesses += 1
        
        # Update game status
        self._update_status()
        self.save()
        
        return is_correct, None
    
    def _update_status(self):
        """Update game status based on current state."""
        if self.status != 'InProgress':
            return
        
        # Check if lost
        if self.incorrect_guesses >= self.max_incorrect_guesses:
            self.status = 'Lost'
            return
        
        # Check if won (all letters guessed)
        word_state = self.get_word_state()
        if '_' not in word_state:
            self.status = 'Won'
    
    def get_state(self):
        """Return the complete game state."""
        return {
            'status': self.status,
            'word_state': self.get_word_state(),
            'incorrect_guesses_made': self.incorrect_guesses,
            'incorrect_guesses_remaining': max(0, self.max_incorrect_guesses - self.incorrect_guesses),
        }
    
    def __str__(self):
        return f"Game {self.id} - {self.word} ({self.status})"
