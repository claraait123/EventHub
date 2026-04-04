from rest_framework import serializers
from .models import Event, Participant, Registration, UserProfile
from django.contrib.auth.models import User


class MemberSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'avatar_url']

    def get_avatar_url(self, obj):
        profile, _ = UserProfile.objects.get_or_create(user=obj)
        return profile.get_avatar_url()


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
            raise serializers.ValidationError("This participant is already registered for this event.")
        return data

class EventSerializer(serializers.ModelSerializer):
    members = MemberSerializer(many=True, read_only=True)
    creator_username = serializers.CharField(source='creator.username', read_only=True)
    creator_avatar = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['creator', 'members']

    def get_creator_avatar(self, obj):
        if not obj.creator:
            return None
        profile, _ = UserProfile.objects.get_or_create(user=obj.creator)
        return profile.get_avatar_url()