from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .models import Event, Participant, Registration, UserProfile
from .serializers import EventSerializer, ParticipantSerializer, RegistrationSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_staff
    
class IsCreatorOrAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.creator == request.user or request.user.is_staff

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsCreatorOrAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['date', 'status']

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

class ParticipantViewSet(viewsets.ModelViewSet):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer
    permission_classes = [IsAdminOrReadOnly]

class RegistrationViewSet(viewsets.ModelViewSet):
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer
    permission_classes = [IsAdminOrReadOnly]


@api_view(['POST'])
@permission_classes([AllowAny])  # Allow anyone to create an account (no need to be logged in)
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'error': 'Veuillez fournir un nom d\'utilisateur et un mot de passe.'}, status=400)
    
    if User.objects.filter(username__iexact=username).exists():
        return Response({'error': 'Ce nom d\'utilisateur est déjà pris.'}, status=400)
    
    # Create the user
    user = User.objects.create_user(username=username, password=password)
    
    # Create the authentication token for this user
    token, created = Token.objects.get_or_create(user=user)
    
    return Response({'token': token.key})

@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_profile(request, username):
    user = get_object_or_404(User, username=username)
    profile, _ = UserProfile.objects.get_or_create(user=user)
    events = Event.objects.filter(creator=user)
    events_data = EventSerializer(events, many=True).data

    return Response({
        'username': user.username,
        'profile_picture': profile.get_avatar_url(),
        'events': events_data
    })

@api_view(['GET'])
def get_current_user(request):
    return Response({
        'id': request.user.id,
        'username': request.user.username,
        'is_staff': request.user.is_staff,
    })

@api_view(['POST'])
def join_event(request, event_id):
    event = get_object_or_404(Event, id=event_id)

    if event.status in ['cancelled', 'completed']:
        return Response({'error': 'You cannot join an event that is cancelled or completed.'}, status=400)
    
    if event.creator == request.user:
        return Response({'error': "You can't join your own event."}, status=400)
    if request.user in event.members.all():
        return Response({'error': 'You already joined this event.'}, status=400)
    
    event.members.add(request.user)
    return Response({'status': 'joined'})

@api_view(['POST'])
def leave_event(request, event_id):
    event = get_object_or_404(Event, id=event_id)
    event.members.remove(request.user)
    return Response({'status': 'left'})

@api_view(['GET'])
def my_events(request):
    events = request.user.joined_events.all()
    data = EventSerializer(events, many=True).data
    return Response(data)

@api_view(['POST'])
def remove_member(request, event_id, user_id):
    event = get_object_or_404(Event, id=event_id)
    
    # Only the creator and admins can remove a participant
    if event.creator != request.user and not request.user.is_staff:
        return Response({'error': 'Not allowed.'}, status=403)
    
    user_to_remove = get_object_or_404(User, id=user_id)
    event.members.remove(user_to_remove)
    return Response({'status': 'removed'})

@api_view(['GET', 'PATCH'])
def user_settings(request):
    user = request.user
    profile, _ = UserProfile.objects.get_or_create(user=user)

    if request.method == 'GET':
        return Response({
            'username': user.username,
            'avatar_seed': profile.avatar_seed,
            'avatar_url': profile.get_avatar_url(),
        })

    if request.method == 'PATCH':
        new_username = request.data.get('username')
        new_seed = request.data.get('avatar_seed')
        new_image = request.data.get('avatar_image')  # base64

        if new_username:
            if User.objects.filter(username__iexact=new_username).exclude(id=user.id).exists():
                return Response({'error': 'This username is already taken.'}, status=400)
            user.username = new_username
            user.save()

        if new_seed is not None:
            profile.avatar_seed = new_seed
            # If a seed is provided again, clear the uploaded image
            profile.avatar_image = ''

        if new_image:
            # Check that it's really a base64 image (starts with data:image/)
            if not new_image.startswith('data:image/'):
                return Response({'error': 'Invalid image format.'}, status=400)
            profile.avatar_image = new_image
            profile.avatar_seed = ''

        profile.save()

        return Response({
            'username': user.username,
            'avatar_seed': profile.avatar_seed,
            'avatar_url': profile.get_avatar_url(),
        })

@api_view(['POST'])
def change_password(request):
    user = request.user
    current = request.data.get('current_password')
    new = request.data.get('new_password')

    if not current or not new:
        return Response({'error': 'Both fields are required.'}, status=400)
    if not user.check_password(current):
        return Response({'error': 'Current password is incorrect.'}, status=400)
    if len(new) < 8:
        return Response({'error': 'New password must be at least 8 characters.'}, status=400)

    user.set_password(new)
    user.save()
    Token.objects.filter(user=user).delete()
    token = Token.objects.create(user=user)
    return Response({'message': 'Password updated successfully.', 'token': token.key})

@api_view(['POST'])
def delete_account(request):
    user = request.user

    if user.is_staff or user.is_superuser:
        return Response({'error': 'Un administrateur ne peut pas supprimer son propre compte.'}, status=403)
    
    password = request.data.get('password')

    if not password:
        return Response({'error': 'Password is required.'}, status=400)
    if not user.check_password(password):
        return Response({'error': 'Incorrect password.'}, status=400)

    user.delete()
    return Response({'message': 'Account deleted successfully.'})

@api_view(['DELETE'])
def delete_user(request, username):
    if not request.user.is_staff:
        return Response({'error': 'Not allowed.'}, status=403)
    
    user_to_delete = get_object_or_404(User, username=username)

    if user_to_delete.is_staff or user_to_delete.is_superuser:
        return Response({'error': 'Impossible de supprimer un administrateur.'}, status=403)
    
    if user_to_delete == request.user:
        return Response({'error': 'You cannot delete your own account from here.'}, status=400)
    
    user_to_delete.delete()
    return Response({'status': 'deleted'})

@api_view(['GET'])
def list_all_users(request):
    if not request.user.is_staff:
        return Response({'error': 'Not authorized'}, status=403)
    
    users = User.objects.all().order_by('-date_joined')
    data = []
    for u in users:
        profile, _ = UserProfile.objects.get_or_create(user=u)
        data.append({
            'id': u.id,
            'username': u.username,
            'date_joined': u.date_joined.strftime("%B %d, %Y") if u.date_joined else "N/A",
            'avatar_url': profile.get_avatar_url(),
            'is_staff': u.is_staff
        })
    return Response(data)

@api_view(['PATCH'])
def admin_edit_user(request, username):
    if not request.user.is_staff:
        return Response({'error': 'Not allowed'}, status=403)
    
    user_to_edit = get_object_or_404(User, username=username)

    if user_to_edit.is_staff or user_to_edit.is_superuser:
        return Response({'error': 'Impossible de modifier le profil d\'un administrateur.'}, status=403)
    
    new_username = request.data.get('username')
    
    if new_username and new_username != user_to_edit.username:
        if User.objects.filter(username__iexact=new_username).exists():
            return Response({'error': 'Username already taken.'}, status=400)
        user_to_edit.username = new_username
        user_to_edit.save()
        
    return Response({'status': 'updated', 'username': user_to_edit.username})