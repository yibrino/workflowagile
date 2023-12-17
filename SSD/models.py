from django.db import models
from django.core.validators import RegexValidator, MinValueValidator, MaxValueValidator

# We are validating both author and title
alphanumeric_validator = RegexValidator(
    regex=r'^[a-zA-Z0-9\s]*$',
    error_message='Only letters, numbers, and spaces are allowed.'
)

# Validating genre if it among ROCK, RAP, TRAP, COUNTRY, PUNK, HOUSE, DANCE.
genre_validator = RegexValidator(
    regex=r'^(ROCK|RAP|TRAP|COUNTRY|PUNK|HOUSE|DANCE)$',
    error_message='Invalid genre. Choose from ROCK, RAP, TRAP, COUNTRY, PUNK, HOUSE, DANCE.'
)

class Song(models.Model):
    author = models.CharField(max_length=100, validators=[alphanumeric_validator])
    title = models.CharField(max_length=100, validators=[alphanumeric_validator])
    genre = models.CharField(max_length=10, validators=[genre_validator])
    
    # Duration is stored as total numebr of seconds
    duration_seconds = models.PositiveIntegerField(
        validators=[MinValueValidator(0)],
        help_text='Duration in seconds'
    )
    
    def __str__(self):
        minutes, seconds = divmod(self.duration_seconds, 60)
        return f'{self.title} by {self.author} ({self.get_genre_display()}) - {minutes}:{seconds:02}'
