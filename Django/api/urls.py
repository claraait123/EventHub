from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, ParticipantViewSet, RegistrationViewSet, register_user, get_user_profile, get_current_user
from rest_framework.authtoken.views import obtain_auth_token

router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'participants', ParticipantViewSet)
router.register(r'registrations', RegistrationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register_user, name='register'),
    path('login/', obtain_auth_token, name='login'),
    path('profiles/<str:username>/', get_user_profile, name='user_profile'),
    path('me/', get_current_user, name='current_user'),
]
