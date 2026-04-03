from django.db import models
from django.contrib.auth.models import User

class Event(models.Model):
    STATUS_CHOICES = [
        ('planned', 'Planned'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planned')
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events', null=True, blank=True)
    members = models.ManyToManyField(User, related_name='joined_events', blank=True)

    def __str__(self):
        return self.title

class Participant(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Registration(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE, related_name='registrations')
    registration_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('event', 'participant')

    def __str__(self):
        return f"{self.participant} -> {self.event}"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar_seed = models.CharField(max_length=100, blank=True)
    avatar_image = models.TextField(blank=True)  # stocke la base64 de l'image

    def get_avatar_url(self):
        # Si une vraie image a été uploadée, on la retourne directement
        if self.avatar_image:
            return self.avatar_image
        # Sinon on utilise DiceBear avec le seed (ou le pseudo par défaut)
        seed = self.avatar_seed if self.avatar_seed else self.user.username
        return f"https://api.dicebear.com/7.x/identicon/svg?seed={seed}"