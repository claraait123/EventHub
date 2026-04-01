from django.urls import path, include
from rest_framework.routers import DefaultRouter
# 1. Ajoutez 'register_user' dans l'import suivant :
from .views import EventViewSet, ParticipantViewSet, RegistrationViewSet, register_user
# 2. Importez obtain_auth_token pour gérer le login automatiquement :
from rest_framework.authtoken.views import obtain_auth_token

router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'participants', ParticipantViewSet)
router.register(r'registrations', RegistrationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    
    # 3. Ajoutez les deux lignes suivantes pour vos pages React
    path('register/', register_user, name='register'),
    path('login/', obtain_auth_token, name='login'),
]