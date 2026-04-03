from rest_framework import serializers
from .models import Event, Participant, Registration
from django.contrib.auth.models import User


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class EventSerializer(serializers.ModelSerializer):
    members = MemberSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['creator', 'members']

class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = '__all__'

class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registration
        fields = '__all__'

    def validate(self, data):
        event = data.get('event')
        participant = data.get('participant')
        if Registration.objects.filter(event=event, participant=participant).exists():
            raise serializers.ValidationError("Ce participant est déjà inscrit à cet événement.")
        return data